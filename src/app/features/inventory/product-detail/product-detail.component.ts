import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../core/data.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.getProducts().subscribe((products) => {
      this.product = products.find((product: { id: number; }) => product.id === productId);
    });
  }
  goBack(): void {
    this.router.navigate(['/inventory']);
  }
  
}
