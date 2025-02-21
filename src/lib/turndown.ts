import TurndownService from "turndown";

export const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    bulletListMarker: '-',
    linkStyle: 'inlined'
});

// remove all link tags
turndown.addRule('linkRemover', {
    filter: 'a',
    replacement: (content) => content
});

// remove all style tags
turndown.addRule('styleRemover', {
    filter: 'style',
    replacement: () => ''
});

// remove all script tags
turndown.addRule('scriptRemover', {
    filter: 'script',
    replacement: () => ''
});

// remove all image tags
turndown.addRule('imgRemover', {
    filter: 'img',
    replacement: (content) => content
})