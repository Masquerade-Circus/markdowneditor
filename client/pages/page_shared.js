let Page = {
    view(vnode) {
        return [
            m('header[data-background="info 600"].shared',
                PAGE.Editor.getHeader()
            ),
            m('article#editor.flex.align-stretch.shared', vnode.children),
            m(COMPONENT.Notification),
            m(COMPONENT.Modal)
        ];
    }
};

export default Page;