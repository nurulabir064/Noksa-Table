import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { dishes } from '../data.js'
import { siteConfig, isDemoContent } from '../config/site.js'
import { buildWhatsAppOrderLink } from '../lib/order-links.js'

export const categoryDetails = [
  { name: 'Starters & Appetizers', slug: 'starters-appetizers', note: 'A considered beginning', description: 'Small plates and first bites made for sharing.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Soups', slug: 'soups', note: 'Warm, fragrant bowls', description: 'Comforting classics and bright, aromatic broths.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Bangladeshi & Traditional', slug: 'bangladeshi-traditional', note: 'Rooted in tradition', description: 'Familiar Bengali favourites and generous table classics.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Indian Cuisine', slug: 'indian-cuisine', note: 'Spice, depth & craft', description: 'A selection inspired by the rich regional flavours of India.', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Chinese Cuisine', slug: 'chinese-cuisine', note: 'Wok-fired favourites', description: 'Savoury, aromatic dishes inspired by Chinese cooking.', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Thai Cuisine', slug: 'thai-cuisine', note: 'Bright & balanced', description: 'Fragrant herbs, lively citrus and balanced heat.', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Italian Cuisine', slug: 'italian-cuisine', note: 'Comfort, simply served', description: 'Italian-inspired favourites, from oven to plate.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Continental & Grill', slug: 'continental-grill', note: 'From the grill', description: 'Grilled plates and familiar continental comfort food.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Seafood Specialties', slug: 'seafood-specialties', note: 'A taste of the coast', description: 'Seafood-led plates, thoughtfully presented.', image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Desserts & Beverages', slug: 'desserts-beverages', note: 'A sweet finish', description: 'Refreshing drinks, coolers and something sweet.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85' },
]

function CategoryDish({ dish }) {
  const [quantity, setQuantity] = useState(1)
  const orderUrl = siteConfig.features.whatsappOrdering ? buildWhatsAppOrderLink(dish, siteConfig.whatsappNumber, quantity, siteConfig.brandName) : null
  const total = dish.price * quantity

  return <article className="premium-dish">
    <Link to={'/menu/' + dish.id} className="premium-dish-image">
      <img src={dish.image} alt={dish.name} loading="lazy" decoding="async" width="900" height="700" />
    </Link>
    <div className="premium-dish-copy">
      <div className="premium-dish-description"><h3><Link to={'/menu/' + dish.id}>{dish.name}</Link></h3><p>{dish.description}</p></div>
    </div>
    <div className="premium-dish-order">
      <div className="premium-order-controls">
        <div className="premium-order-quantity">
          <div className="premium-quantity-label"><span>QUANTITY</span><small>Adjust your selection</small></div>
          <div className="premium-quantity-control" aria-label={dish.name + ' quantity'}>
            <button type="button" onClick={() => { setQuantity(value => Math.max(1, value - 1)) }} aria-label={'Decrease ' + dish.name + ' quantity'} disabled={quantity <= 1}>−</button>
            <output aria-live="polite" aria-label="Selected quantity">{quantity}</output>
            <button type="button" onClick={() => { setQuantity(value => Math.min(99, value + 1)) }} aria-label={'Increase ' + dish.name + ' quantity'} disabled={quantity >= 99}>+</button>
          </div>
        </div>
        <div className="premium-total-price"><span>{isDemoContent ? 'SAMPLE TOTAL' : 'ITEM TOTAL'}</span><strong>৳{total.toLocaleString('en-BD')}</strong></div>
      </div>
      {orderUrl && <a className="premium-order-link" href={orderUrl} target="_blank" rel="noopener noreferrer">Order {quantity} on WhatsApp <ArrowUpRight size={15}/></a>}
    </div>
    {isDemoContent&&<p className="premium-dish-note">Illustrative price only · Final price and availability to be confirmed</p>}
  </article>
}

export function MenuLanding() {
  return <main id="main-content" className="premium-menu-page">
    <header className="premium-menu-heading">
      <span className="premium-kicker">{siteConfig.brandName} · A WORLD OF FLAVOUR</span>
      <h1>Our <em>menu</em></h1>
      <p>Ten thoughtful chapters. Familiar favourites and flavours from around the world.</p>
      <span className="premium-rule" />
    </header>
    <section className="premium-category-grid" aria-label="Menu categories">
      {categoryDetails.map((category, index) => {
        const count = dishes.filter(dish => dish.category === category.name).length
        return <Link className="premium-category-card" to={'/menu/category/' + category.slug} key={category.slug}>
          <img src={category.image} alt="" loading="lazy" decoding="async" />
          <span className="premium-category-shade" />
          <span className="premium-category-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="premium-category-copy"><small>{category.note} · {count} items</small><strong>{category.name}</strong><span>{category.description}</span></span>
          <span className="premium-category-arrow"><ArrowUpRight size={19}/></span>
        </Link>
      })}
    </section>
    {isDemoContent&&<p className="premium-disclaimer">All dishes, descriptions and BDT prices on this concept website are illustrative samples, not a live restaurant menu.</p>}
  </main>
}

export function MenuCategoryPage() {
  const { slug } = useParams()
  const category = categoryDetails.find(item => item.slug === slug)
  if (!category) return <main id="main-content" className="premium-menu-page"><h1>Category not found</h1><Link to="/menu">Back to all categories</Link></main>
  const items = dishes.filter(dish => dish.category === category.name)
  return <main id="main-content" className="premium-category-page">
    <Link className="premium-back-link" to="/menu"><ArrowLeft size={16}/> All menu categories</Link>
    <header className="premium-category-hero">
      <img src={category.image} alt="" fetchPriority="high" decoding="async" />
      <span className="premium-category-hero-shade" />
      <div><span className="premium-kicker">{category.note}</span><h1>{category.name}</h1><p>{category.description}</p></div>
    </header>
    <section className="premium-category-content">
      <div className="premium-section-title"><span className="premium-kicker">THE NOKSHA SELECTION</span><h2>Selected for <em>your table</em></h2><p>{items.length} menu {items.length === 1 ? 'item' : 'items'}</p></div>
      {items.length ? <div className="premium-dish-grid">{items.map(dish => <CategoryDish key={dish.id} dish={dish}/>)}</div> : <p className="premium-empty">This category is being curated. Please check back soon.</p>}
      {isDemoContent&&<p className="premium-disclaimer">Illustrative sample dishes and prices. Replace with restaurant-approved menu information before launch.</p>}
      <Link className="premium-back-bottom" to="/menu">Explore all ten categories <ArrowUpRight size={16}/></Link>
    </section>
  </main>
}
