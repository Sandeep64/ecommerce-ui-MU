import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../shared/services/data/data.service';
import { Catalogue } from '../shared/models/catalogue/catalogue';
import { Item } from '../shared/models/item/item';
import { HttpErrorResponse } from '../shared/models/http-error-response/http-error-response';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  displayedColumnsOfCatalogTable: string[] = [
    'catalog-detail',
    'quantity',
    'items-per-catalog',
    'price-per-peice',
    'stitching',
    'total',
    'action',
  ];
  displayedColumnsOfItemTable: string[] = [
    'item-detail',
    'quantity',
    'null',
    'price',
    'stitching',
    'total',
    'action',
  ];
  dataSourceOfCatalogTable: MatTableDataSource<Catalogue>;
  dataSourceOfItemTable: MatTableDataSource<Item>;

  coupunForm: FormGroup;
  listOfCatalogues: any[];
  listOfItems: any[];
  showError: boolean;
  loading: boolean = true;
  willCatalogTableShow: boolean = false;
  willItemTableShow: boolean = false;
  cartMessage: boolean = false;
  noOfCatalogues = 0;
  noOfItemsInCatalogues = 0;
  noOfItems = 0;
  taxAmount = 50;
  productsTotal = 0;
  totalAmount = 0;
  discountPercentage = 0;
  discountAmount = 0;
  constructor(
    private _dataService: DataService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getCatalogues();
    this.getItems();
    this.initForm();
    
  }

  initForm() {
    this.coupunForm = this._formBuilder.group({
      coupunCode: ['', []],
    });
  }

  onSubmitCoupun(form) {
    this.discountPercentage = Number(form.coupunCode);
    this.discountAmount = (this.productsTotal * this.discountPercentage) / 100;
    this.totalAmount -= this.discountAmount;
    this.coupunForm.controls.coupunCode.setValue("");
  }
  getCatalogues() {
    this._dataService.getCatalogues().subscribe(
      (response: any) => {
        response.length < 1
          ? (this.willCatalogTableShow = false)
          : (this.willCatalogTableShow = true);
        this.listOfCatalogues = response.map((product) => {
          product.total = product.pricePerCatalogue + product.stitching;
          return product;
        });
        this.dataSourceOfCatalogTable = new MatTableDataSource(
          this.listOfCatalogues
        );
        this.showError = false;
        this.loading = false;
      },
      (error) => {
        this.showError = true;
        this.loading = false;
      }
    );
  }

  getItems() {
    this._dataService.getItems().subscribe(
      (response: any) => {
        response.length < 1
          ? (this.willItemTableShow = false)
          : (this.willItemTableShow = true);
        this.listOfItems = response.map((product) => {
          product.total = product.quantity * product.price + product.stitching;
          return product;
        });
        this.dataSourceOfItemTable = new MatTableDataSource(this.listOfItems);
        this.showError = false;
        this.loading = false;
        this.invoiceCalculation();
      },
      (error) => {
        this.showError = true;
        this.loading = false;
      }
    );
  }

  updateNoOfProductsInCart(table, idOfProduct, updateCartIndicator) {
    console.log(table, idOfProduct);
    if (table == 'catalogue') {
      let updatedCatalogueList = this.listOfCatalogues.map((product) => {
        if (product.id == idOfProduct) {
          if (updateCartIndicator == 'increament') {
            product.quantity += 1;
            product.total =
              product.quantity * product.pricePerCatalogue + product.stitching;
          } else if (updateCartIndicator == 'decreament') {
            if (product.quantity > 1) {
              product.quantity -= 1;
              product.total =
                product.quantity * product.pricePerCatalogue +
                product.stitching;
            }
          }
        }
        return product;
      });
      console.log(updatedCatalogueList);
    }
    if (table == 'item') {
      let updatedItemsList = this.listOfItems.map((product) => {
        if (product.id == idOfProduct) {
          if (updateCartIndicator == 'increament') {
            product.quantity += 1;
            product.total =
              product.quantity * product.price + product.stitching;
          } else if (updateCartIndicator == 'decreament') {
            if (product.quantity > 1) {
              product.quantity -= 1;
              product.total =
                product.quantity * product.price + product.stitching;
            }
          }
        }
        return product;
      });
      console.log(updatedItemsList);
    }
    this.invoiceCalculation();
  }

  removeProductFromCart(table, idOfProduct) {
    console.log(table, idOfProduct);
    if (table == 'catalogue') {
      this.listOfCatalogues = this.listOfCatalogues.filter((product) => {
        if (product.id != idOfProduct) {
          return product;
        }
      });
      if (this.listOfCatalogues.length == 0) this.willCatalogTableShow = false;
      this.dataSourceOfCatalogTable = new MatTableDataSource(
        this.listOfCatalogues
      );
    }

    if (table == 'item') {
      this.listOfItems = this.listOfItems.filter((product) => {
        if (product.id != idOfProduct) {
          return product;
        }
      });
      if (this.listOfItems.length == 0) this.willItemTableShow = false;
      this.dataSourceOfItemTable = new MatTableDataSource(this.listOfItems);
    }

    if (this.listOfItems.length == 0 && this.listOfCatalogues.length == 0) {
      this.cartMessage = true;
    }
    this.invoiceCalculation();
  }

  invoiceCalculation() {
    this.noOfCatalogues = 0;
    this.productsTotal = 0;
    this.noOfItems = 0;
    this.totalAmount = 0;
    this.noOfItemsInCatalogues = 0;
    if (this.listOfItems.length == 0 && this.listOfCatalogues.length == 0) {
      this.cartMessage = true;
    }
    if (this.listOfItems.length > 0 || this.listOfCatalogues.length > 0) {
      this.listOfCatalogues.map((product) => {
        this.noOfCatalogues += product.quantity;
        this.noOfItemsInCatalogues +=
          product.quantity * product.itemsPerCatalog;
        this.productsTotal += product.total;
      });
      this.listOfItems.map((product) => {
        this.noOfItems += product.quantity;
        this.productsTotal += product.total;
      });
      this.totalAmount = this.productsTotal + this.taxAmount;
    }
  }

}
