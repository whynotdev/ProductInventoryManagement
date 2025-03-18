import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { DataService } from '../../../core/data.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private products$ = new BehaviorSubject<any[]>([]);
  filteredProducts: any[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((data) => {
      this.products$.next(data);
      this.filteredProducts = data;
    });
  }

  onSearch(query: string): void {
    const products = this.products$.getValue();
    this.filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  viewProduct(id: number): void {
    this.router.navigate([`/inventory/product-detail/${id}`]);
  }

  editProduct(id: number, event: Event): void {
    event.stopPropagation(); // Prevents card click event from triggering
    this.router.navigate([`/inventory/update-product/${id}`]);
  }

  deleteProduct(id: number, event: Event): void {
    event.stopPropagation(); // Prevents card click event from triggering

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'You must be logged in to delete a product!',
        confirmButtonText: 'Login',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth/sign-in']);
        }
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteProduct(id).subscribe({
          next: () => {
            const updatedProducts = this.products$.getValue().filter(product => product.id !== id);
            this.products$.next(updatedProducts);
            this.filteredProducts = updatedProducts;

            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error("Error deleting product:", err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Failed to delete the product!'
            });
          }
        });
      }
    });
  }
}
