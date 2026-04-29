export function todoListPlugin(md) {
  md.core.ruler.after('inline', 'todo_list', (state) => {
    const tokens = state.tokens;
    let listItemLevel = 0;
    const listTokens = [];
    const listItemTokens = [];

    for (const token of tokens) {
      if (token.type === 'bullet_list_open') {
        listTokens.push(token);
        continue;
      }

      if (token.type === 'bullet_list_close') {
        listTokens.pop();
        continue;
      }

      if (token.type === 'list_item_open') {
        listItemLevel += 1;
        listItemTokens.push(token);
        continue;
      }

      if (token.type === 'list_item_close') {
        listItemLevel -= 1;
        listItemTokens.pop();
        continue;
      }

      if (
        listItemLevel === 0 ||
        token.type !== 'inline' ||
        !token.children?.length
      ) {
        continue;
      }

      const checkboxMatch = token.content.match(/^\[( |x)\] /);
      if (!checkboxMatch) continue;

      const firstChild = token.children.find((child) => child.type === 'text');
      if (!firstChild?.content.startsWith(checkboxMatch[0])) continue;

      listTokens.at(-1)?.attrJoin('class', 'todo-list');
      listItemTokens.at(-1)?.attrJoin('class', 'todo-list-item');

      firstChild.content = firstChild.content.slice(checkboxMatch[0].length);
      token.content = token.content.slice(checkboxMatch[0].length);

      const checkboxOpen = new state.Token('html_inline', '', 0);
      checkboxOpen.content = `<a-checkbox :model-value="${checkboxMatch[1] === 'x'}">`;

      const checkboxClose = new state.Token('html_inline', '', 0);
      checkboxClose.content = '</a-checkbox>';

      token.children.unshift(checkboxOpen);
      token.children.push(checkboxClose);
    }
  });
}
