import { MediaMatcher } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DataService } from '../shared/services/data/data.service';
import { Product, NewProduct } from '../shared/models/product/product';
import { PaginationInstance } from 'ngx-pagination';

import * as moment from 'moment';
import { Observable, from, of } from 'rxjs';
import { map, distinct } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAccordion) private accordion: MatAccordion;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private _dataService: DataService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    console.log(moment('19.07.2020', 'DD.MM.YYYY').toDate());
    console.log(moment('19-07-2020', 'DD-MM-YYYY').toDate());
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.getProductsList();
  }

  ngAfterViewInit() {}

  private _mobileQueryListener: () => void;

  mobileQuery: MediaQueryList;
  panelOpenState = false;
  selectedFiltersCheckboxes = [];

  listOfNewProducts = [];
  listOfNewProductsClone = [];
  globalFilteredNewProducts = [];

  categoriesForUpdate = [];
  selectedSortingValueOfNewProducts;

  productStyles = [];
  workTypes = [];
  stitchingTypes = [];

  isCombinationExists: boolean = false;
  isLoading;

  pagination: any = {
    maxSize: 7,
    directionLinks: true,
    autoHide: false,
    responsive: true,
    config: {
      id: 'advanced',
      itemsPerPage: 8,
      currentPage: 1,
    },
    labels: {
      previousLabel: 'Previous',
      nextLabel: 'Next',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`,
    },
  };

  getProductsList() {
    this.isLoading = true;
    this._dataService
      .getProductsListByCategory(4)
      .subscribe((products: any) => {
        this.listOfNewProducts = products;
        this.listOfNewProductsClone = products;
        this.populateFilters();
        this.accordion.openAll();
        this.isLoading = false;
      });
  }

  populateFilters() {
    let obj;
    this.listOfNewProducts.map((product, i) => {
      console.log(product.specifications);
      obj = {
        id: i,
        name: product.specifications.stitchingType,
        value: false,
      };
      this.stitchingTypes.push(obj);
      obj = {
        id: i,
        name: product.specifications.productStyle,
        value: false,
      };
      this.productStyles.push(obj);
      obj = {
        id: i,
        name: product.specifications.workType,
        value: false,
      };
      this.workTypes.push(obj);
    });
    this.stitchingTypes = this.removeDuplicateItems(this.stitchingTypes, 'name')
    this.productStyles = this.removeDuplicateItems(this.productStyles, 'name')
    this.workTypes = this.removeDuplicateItems(this.workTypes, 'name')
  }

  sortBy(nameOfSort, tab) {
    console.log(nameOfSort, tab);
    let sortedProducts;
    let array;
    switch (tab) {
      case 'New Products':
        if (this.globalFilteredNewProducts.length > 0) {
          array = this.globalFilteredNewProducts;
        } else {
          array = this.listOfNewProducts;
        }

        console.log(array);
        break;
    }

    switch (nameOfSort) {
      case 'latest':
        let productsWithDate = array.map((obj) => {
          obj.lastUpdated = moment(obj.lastUpdated, 'DD-MM-YYYY').toDate();
          return obj;
        });
        sortedProducts = productsWithDate
          .slice()
          .sort((a, b) => b.lastUpdated - a.lastUpdated);
        break;
      case 'noOfItemsInStock':
        sortedProducts = array.slice().sort((a, b) => a.quantity - b.quantity);
        break;
      case 'price':
        sortedProducts = array
          .slice()
          .sort((a, b) => parseInt(a.salePrice) - parseInt(b.salePrice));
        break;
    }

    switch (tab) {
      case 'New Products':
        this.listOfNewProducts = sortedProducts;
        break;
    }
  }

  onPageChange(number: number) {
    this.pagination.config.currentPage = number;
  }

  onPageBoundsCorrection(number: number) {
    this.pagination.config.currentPage = number;
  }

  onChange(event, category, type) {
    console.log(event, category, type);
  }

  getUniqueObject(data){
    const unique = [...new Set(data.map(item => item.name))];
    return unique;
  }

  getUniqueObjects(list) {
    return list.filter(
      (object, index, array) =>
        array.findIndex((t) => t.name === object.name) === index
    );
  }

  removeDuplicateItems(array, property) {
    let list = [];
    from(array)
      .pipe(distinct((p: any) => p[`${property}`]))
      .subscribe((x) => list.push(x));
    return list;
  }

  clearAllCheckboxes() {
    this.fabricTypes = this.fabricTypes.map((obj) => {
      obj.value = false;
      return obj;
    });
    this.productStyles = this.productStyles.map((obj) => {
      obj.value = false;
      return obj;
    });
    this.workTypes = this.workTypes.map((obj) => {
      obj.value = false;
      return obj;
    });
    this.stitchingTypes = this.stitchingTypes.map((obj) => {
      obj.value = false;
      return obj;
    });
    this.listOfNewProducts = this.listOfNewProductsClone;
    this.changeDetectorRef.detectChanges();
  }

  sortValues: any[] = [
    { value: 'latest', viewValue: 'Latest' },
    { value: 'noOfItemsInStock', viewValue: 'No of Items' },
    { value: 'price', viewValue: 'Price' },
  ];

  fabricTypes = [
    // {
    //   id: 1,
    //   name: 'Australian Net',
    //   value: false,
    // },
    // { id: 2, name: 'Banarasi Silk', value: false },
    // { id: 3, name: 'Banarsi Jaquard', value: false },
    // { id: 4, name: 'Banglori Silk', value: false },
    // { id: 5, name: 'Bemberg Silk', value: false },
    // { id: 6, name: 'Baraso', value: false },
    // { id: 7, name: 'Pure Silk', value: false },
    // { id: 8, name: 'Cotton', value: false },
    // { id: 9, name: 'Cotton Glace', value: false },
    // { id: 10, name: 'Nylon', value: false },
    // { id: 11, name: 'Chiffon', value: false },
  ];
}
