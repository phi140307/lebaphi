
import ProductDetail from './ProductDetail';

export async function generateStaticParams() {
  // Tạo danh sách tất cả ID sản phẩm có thể có
  const productIds = [];
  for (let i = 1; i <= 50; i++) {
    productIds.push({ id: i.toString() });
  }
  return productIds;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />;
}
