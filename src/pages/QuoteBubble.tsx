
// Text bubble component to highlight  quotes/comments about the need for this site!!
 
import './QuoteBubble.css'
 
interface QuoteBubbleProps {
  text: string
  username: string
  subreddit?: string
  upvotes?: number
  side?: 'left' | 'right' | 'center'
  highlight?: boolean
}
 
const QuoteBubble = ({
  text,
  username,
  subreddit = 'r/Cornell',
  upvotes,
  side = 'left',
  highlight = false,
}: QuoteBubbleProps) => {
  return (
    <div className={`quote-bubble-wrapper side-${side}`}>
      <div className={`quote-bubble ${highlight ? 'highlight' : ''}`}>
        <div className="quote-meta">
          <span className="quote-subreddit">{subreddit}</span>
          <span className="quote-username">u/{username}</span>
          {upvotes !== undefined && (
            <span className="quote-upvotes">▲ {upvotes}</span>
          )}
        </div>
        <p className="quote-text">"{text}"</p>
        <div className="bubble-tail" />
      </div>
    </div>
  )
}
 
export default QuoteBubble