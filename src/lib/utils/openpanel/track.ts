// TODO: OpenPanel tracking helpers — predefined event names

export const OpenPanelEvents = {
	PAGE_VIEW: 'page_view',
	OUTGOING_LINK: 'outgoing_link',
	SEARCH_USED: 'search_used',
	NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
	ARTICLE_REACTED: 'article_reacted',
	COMMENT_OPENED: 'comment_opened',
	COPY_CODE_CLICKED: 'copy_code_clicked'
} as const;

export { trackOpenPanelEvent as track } from './client';
