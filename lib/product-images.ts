type ProductLike = {
  id?: number;
  name: string;
  category: string;
};

type ProductImageConfig = {
  type: 'image' | 'icon';
  src?: string;
  alt?: string;
  fit?: 'contain' | 'cover';
  iconClassName?: string;
  containerClassName?: string;
};

const IMAGE_VERSION = '20260410-2';

function localLogo(path: string) {
  return `${path}?v=${IMAGE_VERSION}`;
}

function createRemoteLogo(query: string, size: number, seed: string) {
  const params = new URLSearchParams({
    query,
    width: String(size),
    height: String(size),
    seq: seed,
    orientation: 'squarish',
  });

  return `https://readdy.ai/api/search-image?${params.toString()}`;
}

export function getProductImage(product: ProductLike, size: number): ProductImageConfig {
  const name = product.name.toLowerCase();
  const category = product.category.toLowerCase();
  const seed = String(product.id ?? product.name);

  if (name.includes('perplexity')) {
    return { type: 'image', src: localLogo('/product-logos/perplexity.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('chatgpt')) {
    return { type: 'image', src: localLogo('/product-logos/chatgpt-plus.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('canva')) {
    return { type: 'image', src: localLogo('/product-logos/canva.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('capcut')) {
    return { type: 'image', src: localLogo('/product-logos/capcut.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('kling')) {
    return { type: 'image', src: localLogo('/product-logos/kling-ai.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('veo')) {
    return { type: 'image', src: localLogo('/product-logos/veo3.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('grok')) {
    return { type: 'image', src: localLogo('/product-logos/grok.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('gemini')) {
    return { type: 'image', src: localLogo('/product-logos/gemini.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('leonardo')) {
    return { type: 'image', src: localLogo('/product-logos/leonardo-ai.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('netflix')) {
    return { type: 'image', src: localLogo('/product-logos/netflix.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('locket')) {
    return { type: 'image', src: localLogo('/product-logos/locket-gold.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('microsoft')) {
    return { type: 'image', src: localLogo('/product-logos/microsoft-365.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('spotify')) {
    return { type: 'image', src: localLogo('/product-logos/spotify.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('quizlet')) {
    return { type: 'image', src: localLogo('/product-logos/quizlet.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('duolingo')) {
    return { type: 'image', src: localLogo('/product-logos/duolingo.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('grammarly')) {
    return { type: 'image', src: localLogo('/product-logos/grammarly.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('adobe')) {
    return { type: 'image', src: localLogo('/product-logos/adobe-creative.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('meitu')) {
    return { type: 'image', src: localLogo('/product-logos/meitu-vip.svg'), alt: product.name, fit: 'contain' };
  }

  if (name.includes('youtube premium')) {
    return { type: 'image', src: localLogo('/product-logos/youtube-premium.svg'), alt: product.name, fit: 'contain' };
  }

  if (category === 'tiktok') {
    return {
      type: 'image',
      src: 'https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/74dc4a4dce6861ebcc79aa07c1ab0b14.png',
      alt: product.name,
      fit: 'contain',
    };
  }

  if (category === 'facebook') {
    return {
      type: 'image',
      src: createRemoteLogo('Facebook like and follow social media blue interface icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  if (category === 'instagram') {
    return {
      type: 'image',
      src: createRemoteLogo('Instagram pink gradient social media engagement icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  if (category === 'youtube') {
    return {
      type: 'image',
      src: createRemoteLogo('YouTube red play button creator channel growth icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  if (category === 'telegram') {
    return {
      type: 'image',
      src: createRemoteLogo('Telegram blue airplane messaging app icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  if (category === 'shopee') {
    return {
      type: 'image',
      src: createRemoteLogo('Shopee orange e-commerce marketplace logo icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  if (category === 'twitter') {
    return {
      type: 'image',
      src: createRemoteLogo('Twitter X black social media logo icon', size, seed),
      alt: product.name,
      fit: 'cover',
    };
  }

  return {
    type: 'icon',
    iconClassName:
      category === 'facebook'
        ? 'ri-facebook-fill text-blue-600'
        : category === 'instagram'
        ? 'ri-instagram-line text-pink-600'
        : category === 'tiktok'
        ? 'ri-tiktok-line text-slate-700'
        : category === 'youtube'
        ? 'ri-youtube-line text-red-600'
        : category === 'telegram'
        ? 'ri-telegram-line text-blue-500'
        : category === 'shopee'
        ? 'ri-shopping-bag-line text-orange-600'
        : category === 'twitter'
        ? 'ri-twitter-line text-sky-500'
        : category === 'microsoft'
        ? 'ri-microsoft-line text-sky-600'
        : 'ri-apps-line text-slate-500',
    containerClassName: 'h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center',
  };
}
