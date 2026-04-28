/**
 * Interactive quantum computing education web interface
 * MNET 2025
 * 
 * JSX component to create a HTML comment.
 */

/**
 * Generate a HTML comment element dynamically
 * @param text The content of the HTML comment
 * @returns JSX script tag containing a HTML comment
 */
const HtmlComment = ({text}: {text: string}) => {
  const html = `<!--${text}-->`;
  return (<script type="text/comment" dangerouslySetInnerHTML={{ __html: html }} />);
};

export default HtmlComment;
