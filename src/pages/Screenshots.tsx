
// Displays reddit posts + community quotes showing the NEED for this website.
 
import { Link } from 'react-router-dom'
import QuoteBubble from './QuoteBubble'
import './Screenshots.css'
 
// Reddit threads proving demand:
// https://www.reddit.com/r/Cornell/comments/170ween/cornell_bathroom_tier_list_so_far_this_semester/
// https://www.reddit.com/r/Cornell/comments/9j3srw/20_year_old_male_looking_for_a_clean_pooping/
// Gatekeeping post: public/gatekeeping.png
 
const quotes = [
  {
    text: "Cornell bathroom tier list so far this semester — somebody needs to make a full database for this.",
    username: "cornellpooper2023",
    upvotes: 312,
    side: 'left' as const,
  },
  {
    text: "20 year old male looking for a clean pooping spot on campus. The Olin ones are disgusting. Help.",
    username: "bathroom_seeker",
    upvotes: 847,
    side: 'right' as const,
    highlight: true,
  },
  {
    text: "A lot of the time, it's hard to know exactly how to get to wheelchair-accessible bathrooms. I wish I knew where they were. Any suggestions?",
    username: "quietflushgang",
    upvotes: 203,
    side: 'left' as const,
  },
  {
    text: "Why is this information so hard to find?? I've been at Cornell for 3 years and only just found the good bathroom in Statler.",
    username: "latebloomerflusher",
    upvotes: 156,
    side: 'right' as const,
  },
  {
    text: "I'd really like to know about gender neutral bathrooms on campus! Help me, please!!!!",
    username: "democratizethebowl",
    upvotes: 94,
    side: 'center' as const,
  },
]
 
const Screenshots = () => {
  return (
    <div className="screenshots-page">
      <div className="screenshots-hero">
        <h1>Why Cornell Bathrooms? 🚽</h1>
        <p className="screenshots-subtitle">
          For years, Cornellians have been crying out for a centralized place
          to discover, rate, and share the best (and worst) bathrooms on campus.
        </p>
        <div className="screenshots-years-badge">
          📅 8+ years of yearning on Reddit
        </div>
      </div>
 
      {/* Quote bubbles section */}
      <section className="screenshots-section">
        <h2 className="section-heading">What people are saying 💬</h2>
        <p className="section-sub">
          (okay these might be made up quotes but trust us... they could be real. also see the link below for real reddit posts!)
        </p>
        <div className="quotes-container">
          {quotes.map((q, i) => (
            <QuoteBubble
              key={i}
              text={q.text}
              username={q.username}
              upvotes={q.upvotes}
              side={q.side}
              highlight={q.highlight}
            />
          ))}
        </div>
        <div className="reddit-links">
          <a
            href="https://www.reddit.com/r/Cornell/comments/170ween/cornell_bathroom_tier_list_so_far_this_semester/"
            target="_blank"
            rel="noopener noreferrer"
            className="reddit-link"
          >
            🔗 See the tier list thread.
          </a>
          <a
            href="https://www.reddit.com/r/Cornell/comments/9j3srw/20_year_old_male_looking_for_a_clean_pooping/"
            target="_blank"
            rel="noopener noreferrer"
            className="reddit-link"
          >
            🔗 A post from 2018... Why hasn't this been made yet?
          </a>
        </div>
      </section>
 
      {/* Gatekeeping section */}
      <section className="screenshots-section gatekeeping-section">
        <h2 className="section-heading">The Gatekeeping Problem 🔒</h2>
        <p className="section-sub">
          Some people think that keeping the best bathrooms a secret is the key to maintaining their cleanliness... but we think that's just gatekeeping! 
        </p>
        <div className="gatekeeping-layout">
          <div className="gatekeeping-image-wrap">
            <img
              src="/gatekeeping.png"
              alt="Reddit post about gatekeeping good bathrooms on Cornell campus"
              className="gatekeeping-img"
            />
            <div className="gatekeeping-caption">
              🤫 "I'm not telling you which ones are clean, that's how I keep them clean"
            </div>
          </div>
          <div className="gatekeeping-callout">
            <span className="callout-emoji">💡</span>
            <p>
              When everyone keeps the best bathrooms a secret, <strong>nobody wins</strong>. Whatever your needs are, whether it's cleaniness, accessibilty, 
              or just a place you feel safe doing your businessm, you deserve to know where they can be met on campus!
              Cornell Bathrooms is the open, crowd-sourced solution we've all needed since 2018.
            </p>
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="screenshots-cta">
        <h2>Be part of the solution. 🪠</h2>
        <p>Add a bathroom. Leave a review. Change a life today.</p>
        <div className="cta-buttons">
          <Link to="/add">
            <button className="cta-primary">Add a Bathroom to Help a Cornellian ➕</button>
          </Link>
          <Link to="/">
            <button className="cta-secondary">Browse Bathrooms 🗺️</button>
          </Link>
        </div>
      </section>
    </div>
  )
}
 
export default Screenshots