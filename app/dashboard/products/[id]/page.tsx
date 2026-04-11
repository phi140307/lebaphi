
import { publicProducts } from '../../../../lib/public-products';
import ProductDetail from './ProductDetail';

export async function generateStaticParams() {
  return publicProducts.map((product) => ({ id: String(product.id) }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetail key={id} productId={id} />;
}
