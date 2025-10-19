/* eslint-disable @typescript-eslint/no-unused-vars */
interface ProductModel {
    id: number;
    type?: string;
    name: string;
    sku?: string;
    short_descr?: string;
    descr?: string;
    sale_price?: number;
    regular_price?: number;
    images?: string;
    is_disable?: number;
    attribute_name?: string;
    attribute_value?: string;
    category_id?: number;
    category_name?: string;
    category_logo?: string;
    brand_id?: number;
    brand_name?: string;
    brand_logo?: string;
    variation?: number;
    event_text?: string;
    event_color?: string;
    in_stock?: number;
}