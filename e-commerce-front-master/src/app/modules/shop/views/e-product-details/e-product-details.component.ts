import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ProductService } from '../../../../core/services/product.service';
import { Cartservice } from '../../../../core/services/cart.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-e-product-details',
  standalone: false,
  templateUrl: './e-product-details.component.html',
  styleUrl: './e-product-details.component.scss',
})
export class EProductDetailsComponent implements OnInit {
  pageTitle: string = 'Product Details';

  selectedVariants: Record<string, string> = {};

  breadcrumb = [
    { title: 'Shop' },
    { title: 'Products' },
    { title: 'Product Details' },
  ];

  selectedQuantity: number = 1;
  // Product Images
  productImages = [
    {
      url: 'images/products/product-details1.jpg',
    },
    {
      url: 'images/products/product-details2.jpg',
    },
    {
      url: 'images/products/product-details3.jpg',
    },
  ];
  selectedImage: string = this.productImages[0].url;
  selectedProduct!: any;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: Cartservice,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe({
      next: (response: any) => {
        const id = response.params.id;
        this.productService
          .findOne(id)
          .pipe(take(1))
          .subscribe({
            next: (response: any) => {
              this.selectedProduct = response;
            },
          });
      },
    });
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  // Tabs
  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
    event.preventDefault();
    this.currentTab = tab;
  }

  onSelectVariants(variants: any) {
    this.selectedVariants = variants; // e.g., { Color: 'Black', Size: 'L' }
  }

  onSelectQuantity(value: number) {
    this.selectedQuantity = value;
  }

  onAddToCart() {
    const user = JSON.parse(this.cookieService.get('user') || '{}');
    const userId = user?.id;

    const newItem = {
      productId: this.selectedProduct.id,
      quantity: this.selectedQuantity,
      price: this.selectedProduct.price,
      selectedVariants: this.selectedVariants,
    };

    if (!userId) {
      // Optional: Save to local storage
      localStorage.setItem('cart', JSON.stringify([newItem]));
      console.error('User not authenticated');
      return;
    }

    this.cartService.findOne().subscribe({
      next: (cart: any) => {
        const existingItems = cart?.items || [];

        // Group identical items and merge quantity
        const mergedMap = new Map<string, typeof newItem>();

        // Step 1: Add existing items
        for (const item of existingItems) {
          const key = `${item.productId}-${JSON.stringify(
            item.selectedVariants
          )}`;
          mergedMap.set(key, {
            productId: Number(item.productId),
            quantity: item.quantity,
            price: item.price,
            selectedVariants: item.selectedVariants,
          });
        }

        // Step 2: Add or merge the new item
        const newKey = `${newItem.productId}-${JSON.stringify(
          newItem.selectedVariants
        )}`;
        if (mergedMap.has(newKey)) {
          const existing = mergedMap.get(newKey)!;
          existing.quantity += newItem.quantity;
        } else {
          mergedMap.set(newKey, newItem);
        }

        const payload = {
          userId,
          items: Array.from(mergedMap.values()),
        };

        this.cartService.update(payload).subscribe({
          next: () => {
            console.log('Item added to cart');
          },
          error: (err) => {
            console.error('Add to cart error:', err);
          },
        });
      },
      error: (err) => {
        console.error('Failed to fetch cart:', err);
      },
    });
  }
}
