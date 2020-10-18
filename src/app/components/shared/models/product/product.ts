export class Product {
  id: string;
  name: string;
  description: string;
  itemsInStock: number;
  price: string;
  productType: string;
  fabricType: string;
  style: string;
  work: string;
  type: string;
  uploadingDate: Date;
  imageUrl: string;
}

export class NewProduct {
  productId: string;
  productName: string;
  productLongName: string;
  productDescription: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  comparePrice: number;
  inStock: boolean;
  isActive: boolean;
  isLatest: boolean;
  itemsInStock: boolean;
  fabricmaterial_type1: string;
  fabricmaterial_type2: string;
  stitching_type: string;
  style: string;
  work: string;
  categoryId_1: string;
  categoryId_2: string;
  updatedBy: string;
  lastUpdated: string;
  
}
