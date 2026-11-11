import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, Search, X } from 'lucide-react'
import { dishes, categories } from './data'
import { siteConfig } from './config/site.js'
import ContactActions from './components/ContactActions.jsx'
import { buildEmailLink, buildWhatsAppLink } from './lib/contact-links.js'
import { buildOrderMessage } from './lib/order-message.js'
import { buildReservationMessage } from './lib/reservation-message.js'
import { getCartSummary, updateCartQuantity } from './lib/cart.js'

function Header(){
  const [open,setOpen]=useState(false);
  const whatsappLink=buildWhatsAppLink({
    phone:siteConfig.whatsappNumber,
    message:'Hello, I found NOKSHA TABLE online and would like to make an enquiry.'
  });
  useEffect(()=>{
    if(!open)return;
    const closeOnEscape=event=>{if(event.key==='Escape')setOpen(false)};
    window.addEventListener('keydown',closeOnEscape);
    return()=>window.removeEventListener('keydown',closeOnEscape);
  },[open]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">ন</span>
        <span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span>
      </Link>
      <button className="mobile-toggle" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation">
        {open?<X/>:<MenuIcon/>}
      </button>
      <nav id="primary-navigation" aria-label="Primary navigation" className={open?'nav open':'nav'}>
        {[['/','Home'],['/menu','Menu'],['/about','Our Story'],['/gallery','Gallery'],['/reservation','Reservation'],['/contact','Contact']].map(([to,label])=>
          <NavLink key={to} to={to} onClick={()=>setOpen(false)} end={to==='/'}>{label}</NavLink>
        )}
        {whatsappLink
          ? <a className="nav-cta" href={whatsappLink.href} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>WhatsApp us <ArrowUpRight size={15}/></a>
          : <Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Contact us <ArrowUpRight size={15}/></Link>}
      </nav>
    </header>
  </>;
}
function Footer(){
  const emailLink = buildEmailLink({ email: siteConfig.publicEmail, subject: siteConfig.emailSubject });
  const whatsappLink = buildWhatsAppLink({ phone: siteConfig.whatsappNumber, message: 'Hello, I would like to contact NOKSHA TABLE.' });

  return (
    <footer className="footer" data-reveal>
      <div className="footer-main">
        <div className="footer-brand-column">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">ন</span>
            <span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span>
          </Link>
          <p>{siteConfig.tagline}</p>
          <span className="footer-demo-label">Restaurant website concept · Demo content</span>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/menu">Food & drinks menu</Link>
          <Link to="/about">Our story</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/reservation">Request a table</Link>
        </div>

        <div className="footer-column">
          <h3>Plan your visit</h3>
          <p>{siteConfig.addressLabel}</p>
          <p>{siteConfig.openingHoursLabel}</p>
          <Link to="/contact">Location & contact details <ArrowUpRight size={14}/></Link>
        </div>

        <div className="footer-column">
          <h3>Get in touch</h3>
          {whatsappLink && <a href={whatsappLink.href} target="_blank" rel="noopener noreferrer">WhatsApp the restaurant <ArrowUpRight size={14}/></a>}
          <Link to="/contact">Contact the restaurant</Link>
          {emailLink && <a href={emailLink.href}>Email the restaurant <ArrowUpRight size={14}/></a>}
          <Link to="/menu">Start an order <ArrowUpRight size={14}/></Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span>
        <span>Sample restaurant information — confirm before launch.</span>
      </div>
    </footer>
  );
}
function DishCard({dish,quantity=0,onAdd,onRemove}){
  return (
    <article className="dish-card">
      <Link to={'/menu/'+dish.id} className="dish-card-link">
        <div className="dish-image">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            decoding="async"
            width="1000"
            height="750"
            onError={event=>{
              event.currentTarget.hidden=true;
              event.currentTarget.parentElement.classList.add('image-missing');
            }}
          />
          <span className="image-fallback" aria-hidden="true">Dish photography update pending</span>
          {dish.tag&&<span className="tag">{dish.tag}</span>}
          <span className="dish-arrow"><ArrowUpRight size={18}/></span>
        </div>
        <div className="dish-meta">
          <div>
            <h3>{dish.name}</h3>
            <p>{dish.category}</p>
            <p className="dish-description">{dish.description}</p>
          </div>
          <strong>৳{dish.price}</strong>
        </div>
      </Link>
      {dish.imageCredit&&<p className="image-credit">Photo: <a href={dish.imageCredit.url} target="_blank" rel="noreferrer">{dish.imageCredit.name}</a> · <a href={dish.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{dish.imageCredit.license}</a></p>}
      {onAdd&&
        <div className="dish-order-control">
          {quantity===0
            ? <button type="button" className="add-to-order" onClick={()=>onAdd(dish.id)} aria-label={'Add '+dish.name+' to order'}>Add to order <span>+</span></button>
            : <div className="quantity-control" aria-label={dish.name+' quantity'}>
                <button type="button" onClick={()=>onRemove(dish.id)} aria-label={'Remove one '+dish.name}>−</button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" onClick={()=>onAdd(dish.id)} disabled={quantity>=99} aria-label={quantity>=99?dish.name+' quantity limit reached':'Add one '+dish.name}>+</button>
                <span>৳{dish.price*quantity}</span>
              </div>}
        </div>}
    </article>
  );
}
function Home(){
  return (
    <main id="main-content">
      <section className="hero">
        <img className="hero-bg" fetchPriority="high" decoding="async" width="2000" height="1100"
          src="https://images.pexels.com/photos/29819295/pexels-photo-29819295.jpeg?auto=compress&cs=tinysrgb&w=2000"
          alt="Elegant contemporary restaurant interior with warm ambient lighting"/>
        <div className="hero-shade"/>
        <p className="hero-photo-credit">Interior photography: <a href="https://www.pexels.com/photo/elegant-modern-restaurant-interior-with-ambient-lighting-29819295/" target="_blank" rel="noopener noreferrer">Pexels</a></p>
        <div className="hero-content">
          <span className="eyebrow light">THAI · CHINESE · INDIAN · CONTINENTAL & MORE</span>
          <h1>A world of<br/><em>flavour.</em><br/>One welcoming table.</h1>
          <p>Discover wok-fired favourites, comforting curries, Continental plates, fresh seafood, handcrafted mocktails and indulgent desserts.</p>
          <div className="hero-actions">
            <Link className="button button-light" to="/menu">Explore the menu <ArrowRight size={16}/></Link>
            <Link className="text-link light-link" to="/about">Discover our story <ArrowUpRight size={16}/></Link>
          </div>
        </div>
        <div className="hero-note">GOOD FOOD. GOOD COMPANY. ALWAYS.</div>
      </section>

      <section className="home-essentials section-wrap" aria-label="Restaurant essentials" data-reveal>
        <article>
          <span className="eyebrow">FIND US</span>
          <strong>Gulshan 2 Circle</strong>
          <p>Dhaka, Bangladesh · Sample landmark</p>
        </article>
        <article>
          <span className="eyebrow">OPENING HOURS</span>
          <strong>Daily · 12 PM–11 PM</strong>
          <p>Illustrative hours · Confirm before launch</p>
        </article>
        <article>
          <span className="eyebrow">YOUR NEXT STEP</span>
          <strong>Good food is one tap away</strong>
          <p><Link to="/menu">Browse the menu <ArrowRight size={14}/></Link></p>
        </article>
      </section>

      <section className="intro section-wrap" data-reveal>
        <div className="eyebrow">THE NOKSHA EXPERIENCE</div>
        <div className="intro-grid">
          <h2>There is a story<br/>in every <em>flavour.</em></h2>
          <div>
            <p className="lead">We bring together much-loved international flavours in a setting shaped by thoughtful hospitality, good ingredients and the joy of sharing.</p>
            <Link className="under-link" to="/about">A little about us <ArrowUpRight size={16}/></Link>
          </div>
        </div>
      </section>

      <section className="featured section-wrap" data-reveal>
        <div className="section-heading">
          <div><div className="eyebrow">FROM OUR KITCHEN</div><h2>Popular picks, <em>thoughtfully served.</em></h2></div>
          <Link className="under-link" to="/menu">View full menu <ArrowRight size={16}/></Link>
        </div>
        <div className="dish-grid">
          {dishes.filter(d=>['grilled-chicken-steak','basmati-kacchi','butter-chicken','grilled-prawn-platter','classic-lasagna','thai-soup','bbq-chicken-pizza','japanese-sushi-roll'].includes(d.id)).map(d=><DishCard key={d.id} dish={d}/>)}
        </div>
      </section>

      <section className="home-story section-wrap" data-reveal>
        <div className="home-story-image">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85" alt="Thoughtfully designed restaurant dining space" loading="lazy" decoding="async"/>
          <span>THE ART OF A GOOD TABLE</span>
        </div>
        <div className="home-story-copy">
          <div className="eyebrow">MORE THAN A MEAL</div>
          <h2>Good food.<br/><em>Better moments.</em></h2>
          <p>A welcoming table brings people together. NOKSHA TABLE is imagined around generous flavours, a relaxed atmosphere and details that make an ordinary meal feel worth remembering. The menu balances familiar comfort food with flavours from across Asia and the Continental kitchen, while the brand experience is designed to be adaptable to each restaurant’s own story.</p>
          <Link className="under-link" to="/about">Discover our approach <ArrowUpRight size={16}/></Link>
        </div>
      </section>

      <section className="quote" data-reveal>
        <span className="eyebrow light">OUR PHILOSOPHY</span>
        <p>“The best meals are not just served.<br/><em>They are shared.”</em></p>
        <span className="quote-mark">ন</span>
      </section>

      <section className="home-highlights section-wrap" data-reveal>
        <div className="eyebrow">A LITTLE MORE TO DISCOVER</div>
        <div className="home-highlight-grid">
          <article><span>01</span><h3>Flavours for every mood</h3><p>From Chinese wok classics and Thai favourites to Continental plates, seafood, mocktails and desserts.</p><Link className="under-link" to="/menu">Browse the menu <ArrowRight size={15}/></Link></article>
          <article><span>02</span><h3>Made for sharing</h3><p>Easy-going dining, generous sharing plates and thoughtful details make every visit feel special.</p><Link className="under-link" to="/about">Our approach <ArrowRight size={15}/></Link></article>
          <article><span>03</span><h3>See the experience</h3><p>Explore a curated look at signature dishes, refreshing drinks, desserts and the dining mood.</p><Link className="under-link" to="/gallery">Explore gallery <ArrowRight size={15}/></Link></article>
        </div>
      </section>

      <section className="home-gallery section-wrap" data-reveal>
        <div className="section-heading">
          <div><div className="eyebrow">A GLIMPSE OF THE TABLE</div><h2>Feast with your <em>eyes.</em></h2></div>
          <Link className="under-link" to="/gallery">View the gallery <ArrowRight size={15}/></Link>
        </div>
        <div className="home-gallery-grid">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85" alt="Warm contemporary restaurant interior" loading="lazy" decoding="async"/>
          <img src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85" alt="Chicken fried rice served fresh" loading="lazy" decoding="async"/>
          <img src="https://images.unsplash.com/photo-1755023033352-e780e7d85637?auto=format&fit=crop&w=900&q=85" alt="Refreshing fruit and mint mocktail" loading="lazy" decoding="async"/>
          <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85" alt="Freshly prepared pasta" loading="lazy" decoding="async"/>
        </div>
      </section>

      <section className="visit section-wrap" data-reveal>
        <div>
          <div className="eyebrow">YOUR TABLE IS WAITING</div>
          <h2>Make room for<br/><em>something good.</em></h2>
          <p>Bring your favourite people. We’ll take care of the rest.</p>
          <div className="visit-actions">
            <Link className="button button-dark" to="/contact">Find us & get in touch <ArrowUpRight size={16}/></Link>
            <Link className="under-link" to="/reservation">Request a table <ArrowRight size={15}/></Link>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85" alt="Elegant restaurant table setting" loading="lazy" decoding="async" width="1200" height="900"/>
      </section>
    </main>
  );
}
function Menu(){
  const [searchParams]=useSearchParams();
  const [cat,setCat]=useState('All');
  const [q,setQ]=useState('');
  const [cart,setCart]=useState(()=>{
    const initialDishId=searchParams.get('add');
    return dishes.some(dish=>dish.id===initialDishId)?{[initialDishId]:1}:{};
  });
  const [fulfilment,setFulfilment]=useState('pickup');
  const [customerName,setCustomerName]=useState('');
  const [customerPhone,setCustomerPhone]=useState('');
  const [deliveryAddress,setDeliveryAddress]=useState('');
  const [orderNote,setOrderNote]=useState('');
  const normalizedQuery=q.trim().toLocaleLowerCase();
  const shown=useMemo(()=>dishes.filter(d=>(cat==='All'||d.category===cat)&&[d.name,d.category,d.description].some(value=>value.toLocaleLowerCase().includes(normalizedQuery))),[cat,normalizedQuery]);
  const order=getCartSummary(cart,dishes);
  const orderMessage=buildOrderMessage({
    restaurantName:siteConfig.brandName,
    items:order.items,
    subtotal:order.subtotal,
    fulfilment,
    customerName,
    customerPhone,
    deliveryAddress,
    orderNote,
  });
  const orderWhatsAppLink=buildWhatsAppLink({phone:siteConfig.whatsappNumber,message:orderMessage});
  const addItem=id=>setCart(current=>updateCartQuantity(current,id,1));
  const removeItem=id=>setCart(current=>updateCartQuantity(current,id,-1));
  const canPrepareOrder=order.items.length>0&&Boolean(orderWhatsAppLink);
  return <main id="main-content" className="page section-wrap menu-page">
    <div className="eyebrow">A THOUGHTFUL SELECTION</div>
    <h1 className="page-title">The <em>menu.</em></h1>
    <p className="page-intro">Explore a course-led selection of small plates, soups and salads, Continental and Italian favourites, Chinese, Thai, Japanese and Indian dishes, Bangladeshi classics, seafood, desserts and handcrafted non-alcoholic drinks.</p>
    <div className="menu-tools">
      <div className="filters" role="group" aria-label="Filter dishes by category">{categories.map(category=><button type="button" aria-pressed={cat===category} className={cat===category?'filter active':'filter'} key={category} onClick={()=>setCat(category)}>{category}</button>)}</div>
      <label className="search"><Search size={17}/><input type="search" aria-label="Search menu dishes" value={q} onChange={event=>setQ(event.target.value)} placeholder="Find a dish"/></label>
    </div>
    <p className="results-count" aria-live="polite">{shown.length} {shown.length===1?'dish':'dishes'} found</p>
    <div className="dish-grid menu-grid" key={cat+"-"+q}>{shown.map(dish=><DishCard key={dish.id} dish={dish} quantity={cart[dish.id]||0} onAdd={addItem} onRemove={removeItem}/>)}</div>
    {!shown.length&&<p className="empty">No dishes match your search. Try another name, description, or category.</p>}
    <section id="order-summary" className="order-summary" aria-labelledby="order-summary-title">
      <div><div className="eyebrow">YOUR SELECTION</div><h2 id="order-summary-title">Your order <em>so far.</em></h2></div>
      {order.items.length===0?<p className="empty-order">Choose a dish above to see your quantity and running total here.</p>:<>
        <ul className="order-lines">{order.items.map(item=><li key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>৳{item.lineTotal}</strong></li>)}</ul>
        <div className="order-total"><span>Food subtotal · {order.totalQuantity} {order.totalQuantity===1?'item':'items'}</span><strong>৳{order.subtotal}</strong></div>
        <div className="fulfilment-panel">
          <div className="eyebrow">HOW WOULD YOU LIKE TO RECEIVE IT?</div>
          <fieldset className="fulfilment-options">
            <legend className="visually-hidden">Choose pickup or delivery request</legend>
            <label className={fulfilment==='pickup'?'fulfilment-option selected':'fulfilment-option'}>
              <input type="radio" name="fulfilment" value="pickup" checked={fulfilment==='pickup'} onChange={()=>setFulfilment('pickup')}/>
              <span><strong>Pickup</strong><small>Collect from the restaurant. Collection details will be confirmed.</small></span>
            </label>
            <label className={fulfilment==='delivery'?'fulfilment-option selected':'fulfilment-option'}>
              <input type="radio" name="fulfilment" value="delivery" checked={fulfilment==='delivery'} onChange={()=>setFulfilment('delivery')}/>
              <span><strong>Delivery request</strong><small>Subject to the restaurant confirming your area and availability.</small></span>
            </label>
          </fieldset>
          <div className="order-customer-fields">
            <label>Your name<input autoComplete="name" value={customerName} onChange={event=>setCustomerName(event.target.value)} maxLength={80} placeholder="Name for this request" required/></label>
            <label>Contact number<input autoComplete="tel" type="tel" inputMode="tel" value={customerPhone} onChange={event=>setCustomerPhone(event.target.value)} maxLength={20} placeholder="Your phone number" required/></label>
            {fulfilment==='delivery'&&<label className="delivery-address-field">Delivery address<input autoComplete="street-address" value={deliveryAddress} onChange={event=>setDeliveryAddress(event.target.value)} maxLength={300} placeholder="House, road, area and city" required/><small>We will send this as a delivery request. Coverage, delivery fee and estimated time must be confirmed by the restaurant.</small></label>}
            <label>Special instructions <span className="optional-label">(optional)</span><textarea value={orderNote} onChange={event=>setOrderNote(event.target.value)} maxLength={500} rows={3} placeholder="Allergies, directions or other requests"/></label>
          </div>
        </div>
        <p className="sample-note order-disclaimer">This opens a WhatsApp draft addressed to the restaurant. Review the name, phone and address before sending; these details are shared only if you send the message. This is a request, not an accepted order. The restaurant must confirm item availability, delivery coverage or pickup arrangements, delivery fee, estimated time and final total. No online payment is taken on this website.</p>
        {orderWhatsAppLink&&canPrepareOrder
          ?<a className="button button-dark whatsapp-order-button" href={orderWhatsAppLink.href} target="_blank" rel="noopener noreferrer">Continue to WhatsApp <ArrowRight size={16}/></a>
          :<button className="button button-dark whatsapp-order-button" type="button" disabled>{orderWhatsAppLink?'Complete the required details':'WhatsApp ordering unavailable'}</button>}
        {!orderWhatsAppLink&&<p className="form-error">WhatsApp ordering is unavailable until a verified restaurant WhatsApp number is configured.</p>}
        {orderWhatsAppLink&&!canPrepareOrder&&<p className="order-validation-hint" role="status">Enter your name and a valid contact number{fulfilment==='delivery'?' and a complete delivery address':''} to continue.</p>}
      </>}
    </section>
    <p className="sample-note">Demo menu: dish names, descriptions, photos and BDT prices are illustrative, not a live restaurant offer. Confirm availability and final prices before launch.</p>
    {order.items.length>0&&<div className="sticky-order-bar" role="region" aria-label="Current order">
      <div><span>{order.totalQuantity} {order.totalQuantity===1?'item':'items'} in your order</span><strong>৳{order.subtotal}</strong></div>
      <a className="sticky-view-order" href="#order-summary">Review</a>
      {orderWhatsAppLink&&canPrepareOrder?<a className="sticky-email" href={orderWhatsAppLink.href} target="_blank" rel="noopener noreferrer">WhatsApp order <ArrowRight size={15}/></a>:<a className="sticky-email" href="#order-summary">Complete details to order</a>}
    </div>}
  </main>
}
function Detail(){
  const {id}=useParams();
  const dish=dishes.find(item=>item.id===id);
  if(!dish)return <main id="main-content" className="page section-wrap"><h1>Dish not found</h1><Link to="/menu">Back to menu</Link></main>;

  return (
    <main id="main-content" className="detail section-wrap">
      <div className="detail-image-wrap">
        <img
          decoding="async"
          fetchPriority="high"
          width="1200"
          height="900"
          src={dish.image}
          alt={dish.name}
          onError={event=>{
            event.currentTarget.hidden=true;
            event.currentTarget.parentElement.classList.add('image-missing');
          }}
        />
        <span className="image-fallback" aria-hidden="true">Dish photography update pending</span>
      </div>
      <div>
        <div className="eyebrow">{dish.category}</div>
        <h1>{dish.name}</h1>
        <strong className="detail-price">৳{dish.price}</strong>
        <p>{dish.description}</p>
        <Link className="button button-dark" to={"/menu?add="+encodeURIComponent(dish.id)+"#order-summary"}>Add to order & choose pickup or delivery <ArrowRight size={16}/></Link>
        {dish.imageCredit&&<p className="image-credit">Photo: <a href={dish.imageCredit.url} target="_blank" rel="noreferrer">{dish.imageCredit.name}</a> · <a href={dish.imageCredit.licenseUrl} target="_blank" rel="noreferrer">{dish.imageCredit.license}</a></p>}
        <p className="sample-note">Illustrative menu item and price.</p>
      </div>
    </main>
  );
}
function About(){
  return (
    <main id="main-content" className="page section-wrap story-page">
      <div className="eyebrow">A TABLE WITH A POINT OF VIEW</div>
      <h1 className="page-title">Our story, in <em>layers.</em></h1>
      <p className="page-intro">A meeting of familiar favourites, new discoveries and the simple pleasure of sharing a meal.</p>

      <section className="story-hero">
        <div className="story-hero-image">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90" alt="Warm restaurant interior with carefully arranged dining tables" loading="lazy" decoding="async"/>
          <span>THE NOKSHA TABLE CONCEPT</span>
        </div>
        <div className="story-hero-copy">
          <span className="eyebrow">THE IDEA</span>
          <h2>A little bit of everywhere, brought to <em>one table.</em></h2>
          <p>NOKSHA TABLE is a multi-cuisine restaurant concept built around a simple idea: food can feel both familiar and new. The experience is designed for guests who want variety without losing the comfort of a welcoming neighbourhood table. From wok-fired favourites and aromatic curries to Continental plates, fresh seafood and handcrafted mocktails, the menu is imagined to give everyone something to look forward to.</p>
          <p>Our story is about the moments around the table — catching up, celebrating, discovering a new favourite and making time for the people who matter. The concept brings together three promises: a menu that is easy to explore, service that feels thoughtful rather than formal, and a setting where quick lunches, family dinners and longer conversations can all belong.</p>
        </div>
      </section>

      <section className="story-principles" aria-label="Our approach">
        <div className="eyebrow">WHAT SHAPES THE EXPERIENCE</div>
        <div className="story-principle-grid">
          <article><span>01</span><h3>Flavour with character</h3><p>A considered mix of international favourites, made for curious appetites and familiar cravings.</p></article>
          <article><span>02</span><h3>Hospitality that feels easy</h3><p>A relaxed setting, thoughtful service and a welcoming experience for every kind of visit.</p></article>
          <article><span>03</span><h3>Moments worth sharing</h3><p>Plates to pass around, conversations to linger over and little reasons to come together.</p></article>
        </div>
      </section>

      <section className="story-closing">
        <span className="eyebrow light">OUR POINT OF VIEW</span>
        <p>“A good table is not only about what is on the plate.<br/><em>It is about who is around it.”</em></p>
        <Link className="button button-light" to="/menu">Explore the menu <ArrowRight size={16}/></Link>
      </section>
      <p className="sample-note story-demo-note">This is fictional brand copy for the NOKSHA TABLE demo. Replace it with the restaurant owner’s approved history, chef details and brand story before client launch.</p>
    </main>
  );
}
function Gallery(){
  const images=[
    {id:'photo-1517248135467-4c7edcad34c4',alt:'Warm contemporary restaurant interior',kind:'Interior'},
    {id:'photo-1414235077428-338989a2e8c0',alt:'Elegant dining table with carefully arranged place settings',kind:'Interior'},
    {id:'photo-1559339352-11d035aa65de',alt:'Restaurant dining room with ambient lighting',kind:'Interior'},
    {id:'photo-1603133872878-684f208fb84b',alt:'A colourful plate of chicken fried rice',kind:'Food'},
    {id:'photo-1513104890138-7c749659a591',alt:'Freshly baked pizza with melted cheese',kind:'Food'},
    {id:'photo-1473093295043-cdd812d0e601',alt:'Pasta served with a creamy sauce',kind:'Food'},
    {id:'photo-1599487488170-d11ec9c172f0',alt:'A platter of grilled tandoori-style food',kind:'Food'},
    {id:'photo-1559737558-2f5a35f4523b',alt:'Seafood platter prepared for sharing',kind:'Food'},
    {id:'photo-1755023033352-e780e7d85637',alt:'A chilled blueberry and mint mocktail',kind:'Drinks'},
    {id:'photo-1750224907018-c89edc4930be',alt:'A strawberry mojito with fresh mint',kind:'Drinks'},
    {id:'photo-1488477181946-6428a0291777',alt:'A strawberry crepe dessert with cream',kind:'Dessert'},
    {id:'photo-1533134242443-d4fd215305ad',alt:'A slice of classic cheesecake',kind:'Dessert'},
    {id:'photo-1559847844-5315695dadae',alt:'A Thai noodle dish served fresh',kind:'Food'},
    {id:'photo-1532550907401-a500c9a57435',alt:'Grilled chicken steak with sides',kind:'Food'},
    {id:'photo-1527477396000-e27163b481c2',alt:'Crispy chicken wings for sharing',kind:'Food'},
    {id:'photo-1775198178204-f127498a97a5',alt:'Thai basil stir-fry with rice',kind:'Food'}
  ];
  const [selected,setSelected]=useState(null);
  const [category,setCategory]=useState('All');
  const closeButtonRef=useRef(null);
  const lightboxPanelRef=useRef(null);
  const triggerRef=useRef(null);
  const categories=['All','Food','Drinks','Dessert','Interior'];
  const visibleImages=category==='All'?images:images.filter(image=>image.kind===category);

  useEffect(()=>{
    if(!selected)return;
    const focusableSelector='button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    closeButtonRef.current?.focus();

    const handleKeyDown=event=>{
      if(event.key==='Escape'){
        setSelected(null);
        return;
      }
      if(event.key!=='Tab')return;

      const focusable=lightboxPanelRef.current?.querySelectorAll(focusableSelector);
      if(!focusable?.length){
        event.preventDefault();
        return;
      }

      const first=focusable[0];
      const last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){
        event.preventDefault();
        last.focus();
      }else if(!event.shiftKey&&document.activeElement===last){
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown',handleKeyDown);
    return()=>{
      window.removeEventListener('keydown',handleKeyDown);
      triggerRef.current?.focus();
    };
  },[selected]);

  return (
    <main id="main-content" className="page section-wrap gallery-page">
      <div className="eyebrow">A FEAST FOR THE EYES</div>
      <h1 className="page-title">A seat at <em>our table.</em></h1>
      <p className="page-intro">A curated look at the dishes, drinks and dining atmosphere imagined for this multi-cuisine restaurant concept.</p>

      <div className="gallery-toolbar">
        <p>Food, drinks & atmosphere <span>— {visibleImages.length} photographs</span></p>
        <div className="gallery-filters" role="group" aria-label="Filter gallery photographs">
          {categories.map(item=><button key={item} type="button" className={category===item?'active':''} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}
        </div>
      </div>

      <div className="gallery-grid">
        {visibleImages.map((image,i)=><button type="button" className="gallery-item" key={image.id} onClick={event=>{triggerRef.current=event.currentTarget;setSelected(image)}} aria-label={'View image: '+image.alt}>
          <img loading="lazy" decoding="async" width="1000" height="750" src={'https://images.unsplash.com/'+image.id+'?auto=format&fit=crop&w=1000&q=85'} alt={image.alt} onError={event=>{event.currentTarget.hidden=true;event.currentTarget.parentElement.classList.add('image-missing')}}/>
          <span className="image-fallback" aria-hidden="true">Photo unavailable — replace this demo image before launch</span>
          <span className="gallery-item-caption"><span>{image.kind}</span><strong>{image.alt}</strong></span>
        </button>)}
      </div>

      <p className="sample-note gallery-demo-note">Demo photography is illustrative and is not a representation of the restaurant’s actual dishes or interior. Replace it with owner-approved, correctly matched photographs before a restaurant launch.</p>

      {selected&&<div className="gallery-lightbox" role="presentation" onClick={()=>setSelected(null)}>
        <div ref={lightboxPanelRef} className="gallery-lightbox-panel" role="dialog" aria-modal="true" aria-label={selected.alt} aria-describedby="gallery-lightbox-caption" onClick={event=>event.stopPropagation()}>
          <button ref={closeButtonRef} type="button" className="gallery-lightbox-close" onClick={()=>setSelected(null)} aria-label="Close image">×</button>
          <img src={'https://images.unsplash.com/'+selected.id+'?auto=format&fit=max&w=1800&q=90'} alt={selected.alt} onError={event=>{event.currentTarget.hidden=true;event.currentTarget.parentElement.classList.add('image-missing')}}/>
          <span className="image-fallback" aria-hidden="true">Photo unavailable — replace this demo image before launch</span>
          <p id="gallery-lightbox-caption">{selected.alt}</p>
        </div>
      </div>}
    </main>
  );
}
function getLocalDateValue(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return values.year+'-'+values.month+'-'+values.day}
function FormPage({reservation=false}){
  const [sent,setSent]=useState(false);
  const [idempotencyKey,setIdempotencyKey]=useState(()=>{
    if(!reservation)return '';
    try{
      const existing=sessionStorage.getItem('noksha-reservation-idempotency-key');
      if(existing)return existing;
      const generated=crypto.randomUUID();
      sessionStorage.setItem('noksha-reservation-idempotency-key',generated);
      return generated;
    }catch{
      return crypto.randomUUID();
    }
  });
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const privacyUrl=import.meta.env.VITE_PRIVACY_POLICY_URL;
  const privacyPolicyVersion=import.meta.env.VITE_PRIVACY_POLICY_VERSION;
  const hasSecurePrivacyNotice=(()=>{
    try{return new URL(privacyUrl).protocol==='https:'}catch{return false}
  })();
  const reservationEnabled=import.meta.env.VITE_RESERVATIONS_ENABLED==='true'
    && hasSecurePrivacyNotice
    && Boolean(privacyPolicyVersion);

  async function handleSubmit(event){
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity())return;

    if(!reservation){
      const formData = new FormData(form);
      const body = [
        'Name: ' + formData.get('name'),
        'Reply email: ' + formData.get('email'),
        '',
        'Message:',
        formData.get('message')
      ].join('\n');
      const emailLink = buildEmailLink({ email: siteConfig.publicEmail, subject: 'Website enquiry — ' + siteConfig.brandName, body });
      if (!emailLink) {
        setError('The restaurant email address is not configured for this demo. No message was sent.');
        return;
      }
      window.location.href = emailLink.href;
      setSent(true);
      return;
    }

    if(!reservationEnabled){
      const formData=new FormData(form);
      const message=buildReservationMessage({
        name:formData.get('name'),
        email:formData.get('email'),
        phone:formData.get('phone'),
        date:formData.get('date'),
        time:formData.get('time'),
        guestCount:formData.get('guestCount'),
        notes:formData.get('message')
      });
      const whatsappLink=buildWhatsAppLink({phone:siteConfig.whatsappNumber,message});
      if(!whatsappLink){
        setError('WhatsApp reservation requests are unavailable until the restaurant number is configured.');
        return;
      }
      window.location.assign(whatsappLink.href);
      return;
    }

    setLoading(true);
    setError('');
    try{
      const formData=new FormData(form);
      const response=await fetch('/api/reservations',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:formData.get('name'),
          email:formData.get('email'),
          phone:formData.get('phone'),
          date:formData.get('date'),
          time:formData.get('time'),
          guestCount:formData.get('guestCount'),
          message:formData.get('message'),
          website:formData.get('website'),
          consent:formData.get('consent')==='on',
          idempotencyKey
        })
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'We could not submit your request.');
      setSent(true);
      try{sessionStorage.removeItem('noksha-reservation-idempotency-key')}catch{}
    }catch(err){
      setError(err instanceof Error?err.message:'A network error occurred. Please try again.');
    }finally{
      setLoading(false);
    }
  }

  return <main id="main-content" className="page section-wrap form-page">
    <div className="eyebrow">{reservation?'LET’S SAVE YOU A SEAT':'WE’D LOVE TO HEAR FROM YOU'}</div>
    <h1 className="page-title">{reservation?'Join us at the':'Say hello to'} <em>{reservation?'table.':siteConfig.brandName+'.'}</em></h1>
    <p className="page-intro">{reservation?'Choose your preferred date and time. A request is not a confirmed booking.':'Questions about the menu, a group visit or the restaurant concept? Send an email to the team.'}</p>
    {sent
      ? <div className="success" role="status" aria-live="polite">
          <h2>{reservation?'Request received.':'Email draft opened.'}</h2>
          <p>{reservation?'Your request is pending. The restaurant must contact you to confirm availability.':'Your email app should open with the recipient and message filled in. Review it and press Send to deliver it.'}</p>
          <button type="button" className="under-link" onClick={()=>{setSent(false);if(reservation){const next=crypto.randomUUID();setIdempotencyKey(next);try{sessionStorage.setItem('noksha-reservation-idempotency-key',next)}catch{}}}}>Start again</button>
        </div>
      : <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your name<input required name="name" autoComplete="name" maxLength="80" placeholder="Full name"/></label>
          <label>Email address<input required type="email" name="email" autoComplete="email" maxLength="254" placeholder="you@example.com"/></label>
          {reservation&&<>
            <label>Phone number<input required type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength="25" placeholder="+880 1XXXXXXXXX"/></label>
            <div className="form-row">
              <label>Date<input required type="date" name="date" min={getLocalDateValue()}/></label>
              <label>Preferred time<input required type="time" name="time"/></label>
            </div>
            <label>Number of guests<select name="guestCount" defaultValue="2" required><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 guests</option><option value="6">6 guests</option></select></label>
            <label className="reservation-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex="-1" autoComplete="off"/></label>
          </>}
          <label>{reservation?'Additional notes (optional)':'Your message'}<textarea name="message" rows="4" maxLength={reservation?1000:2000} placeholder="Write your message..." required={!reservation}/></label>
          {reservation&&reservationEnabled&&<label className="consent-field"><input type="checkbox" name="consent" required/><span>I have read the <a href={privacyUrl}>privacy notice</a> and agree that my details may be used to respond to this reservation request.</span></label>}
          {reservation&&!reservationEnabled&&<p className="sample-note">This prepares a reservation request in WhatsApp. Review the details and press Send yourself. The restaurant must confirm availability; no booking is confirmed by this form.</p>}
          {error&&<p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading?'Submitting…':reservation?(reservationEnabled?'Send reservation request':'Continue to WhatsApp') :'Open email app'} <ArrowRight size={16}/>
          </button>
          <p className="sample-note">{reservation?'A request remains pending until the restaurant confirms it.' :'Your device needs an email app or browser mail handler configured. The message is not sent until you press Send.'}</p>
        </form>}
  </main>
}
function Contact(){return <><FormPage/><section className="contact-details section-wrap" data-reveal><div><div className="eyebrow">PLAN YOUR VISIT</div><h2>Find your way to <em>our table.</em></h2><p className="page-intro">Plan a visit with the sample location and hours below. These details are for the NOKSHA TABLE demo concept only and must be replaced with the restaurant’s verified information before launch.</p></div><div className="contact-details-card"><ContactActions/></div></section></>}
export default function App(){const {pathname}=useLocation();useEffect(()=>{const brand=siteConfig.brandName;const siteBaseUrl=siteConfig.siteUrl.endsWith('/')?siteConfig.siteUrl.slice(0,-1):siteConfig.siteUrl;const titles={'/':brand+' | '+siteConfig.descriptor,'/menu':'Menu | '+brand,'/about':'Our Story | '+brand,'/gallery':'Gallery | '+brand,'/reservation':'Reserve a Table | '+brand,'/contact':'Contact | '+brand};const descriptions={'/':siteConfig.tagline,'/menu':'Explore the illustrative multi-cuisine menu at ' + brand + '.','/about':'Discover the multi-cuisine idea behind ' + brand + '.', '/gallery':'Explore the gallery for ' + brand + '.','/reservation':'Send a demonstration table reservation request for ' + brand + '.','/contact':'Contact ' + brand + '.'};document.title=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.'));const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',siteBaseUrl+(pathname==='/'?'/':pathname));const meta=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};const pageTitle=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const pageDescription=descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.');meta('meta[property="og:title"]',pageTitle);meta('meta[property="og:description"]',pageDescription);meta('meta[property="og:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="twitter:title"]',pageTitle);meta('meta[name="twitter:description"]',pageDescription);meta('meta[name="twitter:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="robots"]',titles[pathname]||pathname.startsWith('/menu/')?'index,follow':'noindex,follow');if(window.location.hash){const target=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}else{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduceMotion){document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));return}const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[pathname]);return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/menu/:id" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/reservation" element={<FormPage reservation/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<main id="main-content" className="page section-wrap"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
