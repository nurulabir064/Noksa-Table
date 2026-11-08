import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Menu as MenuIcon, Search, X } from 'lucide-react'
import { dishes, categories } from './data'
import { siteConfig } from './config/site.js'
import ContactActions from './components/ContactActions.jsx'
import { buildEmailLink } from './lib/contact-links.js'
import { buildOrderMessage } from './lib/order-message.js'
import { getCartSummary, updateCartQuantity } from './lib/cart.js'

function Header(){const [open,setOpen]=useState(false);const emailLink=buildEmailLink({email:siteConfig.publicEmail,subject:siteConfig.emailSubject,body:'Hello, I found NOKSHA TABLE online and would like to know more.'});useEffect(()=>{if(!open)return;const closeOnEscape=event=>{if(event.key==='Escape')setOpen(false)};window.addEventListener('keydown',closeOnEscape);return()=>window.removeEventListener('keydown',closeOnEscape)},[open]);return <><a className="skip-link" href="#main-content">Skip to content</a><header className="header"><Link className="brand" to="/"><span className="brand-mark">ন</span><span>{siteConfig.brandName}<small>{siteConfig.descriptor}</small></span></Link><button className="mobile-toggle" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<MenuIcon/>}</button><nav id="primary-navigation" aria-label="Primary navigation" className={open?'nav open':'nav'}>{[['/','Home'],['/menu','Menu'],['/about','Our Story'],['/gallery','Gallery'],['/contact','Contact']].map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} end={to==='/'}>{label}</NavLink>)}{emailLink?<a className="nav-cta" href={emailLink.href} onClick={()=>setOpen(false)}>Email us <ArrowUpRight size={15}/></a>:<Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Contact us <ArrowUpRight size={15}/></Link>}</nav></header></>}
function Footer(){
  const emailLink = buildEmailLink({ email: siteConfig.publicEmail, subject: siteConfig.emailSubject });

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
                <button type="button" onClick={()=>onAdd(dish.id)} aria-label={'Add one '+dish.name}>+</button>
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
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=90"
          alt="Warm contemporary restaurant dining room"/>
        <div className="hero-shade"/>
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
          {dishes.filter(d=>['thai-soup','chicken-fried-rice-combo','bbq-chicken-pizza','chicken-chow-mein'].includes(d.id)).map(d=><DishCard key={d.id} dish={d}/>)}
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
          <img src="https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?auto=format&fit=crop&w=900&q=85" alt="Refreshing fruit and mint mocktail" loading="lazy" decoding="async"/>
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
function Menu(){const [cat,setCat]=useState('All'),[q,setQ]=useState(''),[cart,setCart]=useState({});const normalizedQuery=q.trim().toLocaleLowerCase();const shown=useMemo(()=>dishes.filter(d=>(cat==='All'||d.category===cat)&&[d.name,d.category,d.description].some(value=>value.toLocaleLowerCase().includes(normalizedQuery))),[cat,normalizedQuery]);const order=getCartSummary(cart,dishes);const orderMessage=buildOrderMessage({restaurantName:siteConfig.brandName,items:order.items,subtotal:order.subtotal});const orderEmailLink=buildEmailLink({email:siteConfig.publicEmail,subject:'Menu order enquiry — '+siteConfig.brandName,body:orderMessage});const addItem=id=>setCart(current=>updateCartQuantity(current,id,1));const removeItem=id=>setCart(current=>updateCartQuantity(current,id,-1));return <main id="main-content" className="page section-wrap menu-page"><div className="eyebrow">A THOUGHTFUL SELECTION</div><h1 className="page-title">The <em>menu.</em></h1><p className="page-intro">Browse a considered mix of Chinese, Thai, Indian and Continental favourites, plus seafood, mocktails, desserts and easy-to-share combos.</p><div className="menu-tools"><div className="filters" role="group" aria-label="Filter dishes by category">{categories.map(c=><button type="button" aria-pressed={cat===c} className={cat===c?'filter active':'filter'} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div><label className="search"><Search size={17}/><input type="search" aria-label="Search menu dishes" value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a dish"/></label></div><p className="results-count" aria-live="polite">{shown.length} {shown.length===1?'dish':'dishes'} found</p><div className="dish-grid menu-grid" key={cat+"-"+q}>{shown.map(d=><DishCard key={d.id} dish={d} quantity={cart[d.id]||0} onAdd={addItem} onRemove={removeItem}/>)}</div>{!shown.length&&<p className="empty">No dishes match your search. Try another name, description, or category.</p>}<section className="order-summary" aria-labelledby="order-summary-title"><div><div className="eyebrow">YOUR SELECTION</div><h2 id="order-summary-title">Your order <em>so far.</em></h2></div>{order.items.length===0?<p className="empty-order">Choose a dish above to see your quantity and running total here.</p>:<><ul className="order-lines">{order.items.map(item=><li key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>৳{item.lineTotal}</strong></li>)}</ul><div className="order-total"><span>Subtotal · {order.totalQuantity} {order.totalQuantity===1?'item':'items'}</span><strong>৳{order.subtotal}</strong></div><p className="sample-note">Your selected dishes and subtotal will be added to an email draft addressed to the restaurant. The restaurant must confirm availability, delivery or pickup details, final charges and payment directly. This website does not process online payments.</p>{orderEmailLink?<a className="button button-dark order-email-button" href={orderEmailLink.href}>Prepare order email <ArrowRight size={16}/></a>:<Link className="button button-dark" to="/contact">Contact the restaurant <ArrowRight size={16}/></Link>}</>}</section><p className="sample-note">Demo menu: dish names, descriptions, photos and BDT prices are illustrative, not a live restaurant offer. Confirm availability and final prices before launch.</p>{order.items.length>0&&<div className="sticky-order-bar" role="region" aria-label="Current order"><div><span>{order.totalQuantity} {order.totalQuantity===1?'item':'items'} in your order</span><strong>৳{order.subtotal}</strong></div><a className="sticky-view-order" href="#order-summary">Review</a>{orderEmailLink?<a className="sticky-email" href={orderEmailLink.href}>Email order <ArrowRight size={15}/></a>:<Link className="sticky-email" to="/contact">Contact to order <ArrowRight size={15}/></Link>}</div>}</main>}
function Detail(){
  const {id}=useParams();
  const dish=dishes.find(item=>item.id===id);
  if(!dish)return <main id="main-content" className="page section-wrap"><h1>Dish not found</h1><Link to="/menu">Back to menu</Link></main>;

  const emailLink=buildEmailLink({
    email:siteConfig.publicEmail,
    subject:'Dish enquiry — '+siteConfig.brandName,
    body:buildOrderMessage({
      restaurantName:siteConfig.brandName,
      items:[{name:dish.name,quantity:1,lineTotal:dish.price}],
      subtotal:dish.price
    })
  });

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
        {emailLink
          ? <a className="button button-dark" href={emailLink.href}>Enquire about this dish <ArrowRight size={16}/></a>
          : <Link className="button button-dark" to="/contact">Contact to place an order <ArrowRight size={16}/></Link>}
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
    {id:'photo-1513558161293-cdaf765edfd4',alt:'A chilled fruit and mint mocktail',kind:'Drinks'},
    {id:'photo-1536935338788846bb9981813',alt:'A strawberry and lime mocktail',kind:'Drinks'},
    {id:'photo-1488477181946-6428a0291777',alt:'A strawberry crepe dessert with cream',kind:'Dessert'},
    {id:'photo-1533134242443-d4fd215305ad',alt:'A slice of classic cheesecake',kind:'Dessert'},
    {id:'photo-1559847844-5315695dadae',alt:'A Thai noodle dish served fresh',kind:'Food'},
    {id:'photo-1532550907401-a500c9a57435',alt:'Grilled chicken steak with sides',kind:'Food'},
    {id:'photo-1527477396000-e27163b481c2',alt:'Crispy chicken wings for sharing',kind:'Food'},
    {id:'photo-1515003197210-e0cd7184f8b5',alt:'A colourful rice and curry plate',kind:'Food'}
  ];
  const [selected,setSelected]=useState(null);
  const [category,setCategory]=useState('All');
  const categories=['All','Food','Drinks','Dessert','Interior'];
  const visibleImages=category==='All'?images:images.filter(image=>image.kind===category);

  useEffect(()=>{
    if(!selected)return;
    const close=event=>{if(event.key==='Escape')setSelected(null)};
    window.addEventListener('keydown',close);
    return()=>window.removeEventListener('keydown',close);
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
        {visibleImages.map((image,i)=><button type="button" className="gallery-item" key={image.id} onClick={()=>setSelected(image)} aria-label={'View image: '+image.alt}>
          <img loading="lazy" decoding="async" width="1000" height="750" src={'https://images.unsplash.com/'+image.id+'?auto=format&fit=crop&w=1000&q=85'} alt={image.alt}/>
          <span className="gallery-item-caption"><span>{image.kind}</span><strong>{image.alt}</strong></span>
        </button>)}
      </div>

      <p className="sample-note gallery-demo-note">Demo photography is illustrative and is not a representation of the restaurant’s actual dishes or interior. Replace it with owner-approved, correctly matched photographs before a restaurant launch.</p>

      {selected&&<div className="gallery-lightbox" role="presentation" onClick={()=>setSelected(null)}>
        <div className="gallery-lightbox-panel" role="dialog" aria-modal="true" aria-label={selected.alt} onClick={event=>event.stopPropagation()}>
          <button type="button" className="gallery-lightbox-close" onClick={()=>setSelected(null)} aria-label="Close image">×</button>
          <img src={'https://images.unsplash.com/'+selected.id+'?auto=format&fit=max&w=1800&q=90'} alt={selected.alt}/>
          <p>{selected.alt}</p>
        </div>
      </div>}
    </main>
  );
}
function getLocalDateValue(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));return values.year+'-'+values.month+'-'+values.day}
function FormPage({reservation=false}){
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const reservationEnabled=import.meta.env.VITE_RESERVATIONS_ENABLED==='true'
    && Boolean(import.meta.env.VITE_PRIVACY_POLICY_URL);
  const privacyUrl=import.meta.env.VITE_PRIVACY_POLICY_URL;

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
        setError('The restaurant email address is not configured. Please use the email shown in Contact details.');
        return;
      }
      window.location.href = emailLink.href;
      setSent(true);
      return;
    }

    if(!reservationEnabled){
      setError('Online reservation requests are not active yet. No personal details have been submitted.');
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
          consent:formData.get('consent')==='on'
        })
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'We could not submit your request.');
      setSent(true);
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
          <button type="button" className="under-link" onClick={()=>setSent(false)}>Start again</button>
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
          {reservation&&!reservationEnabled&&<p className="sample-note">Online reservations are not enabled. This form will not send or store your personal details.</p>}
          {error&&<p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" type="submit" disabled={loading||(reservation&&!reservationEnabled)}>
            {loading?'Submitting…':reservation?(reservationEnabled?'Send reservation request':'Reservations coming soon') :'Open email app'} <ArrowRight size={16}/>
          </button>
          <p className="sample-note">{reservation?'A request remains pending until the restaurant confirms it.' :'Your device needs an email app or browser mail handler configured. The message is not sent until you press Send.'}</p>
        </form>}
  </main>
}
function Contact(){return <><FormPage/><section className="contact-details section-wrap" data-reveal><div><div className="eyebrow">PLAN YOUR VISIT</div><h2>Find your way to <em>our table.</em></h2><p className="page-intro">Plan a visit with the sample location and hours below. These details are for the NOKSHA TABLE demo concept only and must be replaced with the restaurant’s verified information before launch.</p></div><div className="contact-details-card"><ContactActions/></div></section></>}
export default function App(){const {pathname}=useLocation();useEffect(()=>{const brand=siteConfig.brandName;const siteBaseUrl=siteConfig.siteUrl.endsWith('/')?siteConfig.siteUrl.slice(0,-1):siteConfig.siteUrl;const titles={'/':brand+' | '+siteConfig.descriptor,'/menu':'Menu | '+brand,'/about':'Our Story | '+brand,'/gallery':'Gallery | '+brand,'/reservation':'Reserve a Table | '+brand,'/contact':'Contact | '+brand};const descriptions={'/':siteConfig.tagline,'/menu':'Explore the illustrative multi-cuisine menu at ' + brand + '.','/about':'Discover the multi-cuisine idea behind ' + brand + '.', '/gallery':'Explore the gallery for ' + brand + '.','/reservation':'Send a demonstration table reservation request for ' + brand + '.','/contact':'Contact ' + brand + '.'};document.title=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute('content',descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.'));const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.setAttribute('href',siteBaseUrl+(pathname==='/'?'/':pathname));const meta=(selector,value)=>{const node=document.querySelector(selector);if(node)node.setAttribute('content',value)};const pageTitle=titles[pathname]||(pathname.startsWith('/menu/')?'Dish Details | ' + brand + '':'Page Not Found | ' + brand + '');const pageDescription=descriptions[pathname]||(pathname.startsWith('/menu/')?'Explore a sample multi-cuisine dish at ' + brand + '.':'The requested page could not be found on ' + brand + '.');meta('meta[property="og:title"]',pageTitle);meta('meta[property="og:description"]',pageDescription);meta('meta[property="og:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="twitter:title"]',pageTitle);meta('meta[name="twitter:description"]',pageDescription);meta('meta[name="twitter:url"]',siteBaseUrl+(pathname==='/'?'/':pathname));meta('meta[name="robots"]',titles[pathname]||pathname.startsWith('/menu/')?'index,follow':'noindex,follow');window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduceMotion){document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));return}const nodes=document.querySelectorAll('[data-reveal]');if(!('IntersectionObserver' in window)){nodes.forEach(node=>node.classList.add('is-visible'));return}const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect()},[pathname]);return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/><Route path="/menu/:id" element={<Detail/>}/><Route path="/about" element={<About/>}/><Route path="/gallery" element={<Gallery/>}/><Route path="/reservation" element={<FormPage reservation/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<main id="main-content" className="page section-wrap"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/></Routes><Footer/></>}
