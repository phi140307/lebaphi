
import ProductDetail from './ProductDetail';

export async function generateStaticParams() {
  return Array.from({ length: 59 }, (_, index) => ({ id: String(index + 1) }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />;
}
