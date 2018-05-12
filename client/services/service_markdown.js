import marked from 'marked';
let Markdown = {
    render(code) {
        return marked(code);
    }
};

export default Markdown;