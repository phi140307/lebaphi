
import ProductDetail from './ProductDetail';

export async function generateStaticParams() {
  return Array.from({ length: 59 }, (_, index) => ({ id: String(index + 1) }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetail productId={id} />;
}
