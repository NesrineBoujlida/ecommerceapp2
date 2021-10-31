import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

   products: Product[] = [];
   currentCategoryId = 1;
   previousCategoryId = 1;
   searchMode = false;

   // new properties for pagination
   thePageNumber = 1;
   thePageSize = 10;
   theTotalElements = 0;


  constructor(private productService: ProductService,
              private cartService: CartService, private route: ActivatedRoute
               ){ }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.route.paramMap.subscribe(()  => {
    this.listProducts();
  });
}
  // tslint:disable-next-line:typedef
  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
  }
  }


  // tslint:disable-next-line:typedef
  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // now search for the products using keyword

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );


  }
  // tslint:disable-next-line:typedef
  handleListProducts(){

    // check if "id" parameter is available
const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

if (hasCategoryId){
  // get the "id" param string to a number using the "+" symbol
  this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
}

else {
  // not category id available .. default to category id 1
  this.currentCategoryId = 1;
}

//
// check if we have a different category than previous
// Note: Angular will reuse a component if it is currently being viewed
//

// if we have thePageNumber back to 1
// tslint:disable-next-line:triple-equals
if (this.previousCategoryId != this.currentCategoryId){
  this.thePageNumber = 1;
}

this.previousCategoryId = this.currentCategoryId;

console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

// now get the products for the given category id

this.productService.getProductListPaginate(this.thePageNumber - 1 ,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                                .subscribe(this.processResult());


  }

  // tslint:disable-next-line:typedef
  processResult() {
    return data => {
    this.products = data._embedded.products;
    this.thePageNumber = data.page.number + 1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
  };
}



  // tslint:disable-next-line:typedef
  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
