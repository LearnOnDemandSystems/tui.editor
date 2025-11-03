import { Schema, ProsemirrorNode } from 'prosemirror-model';
import { CustomInlineMdNode } from '@toast-ui/toastmark';
import { WidgetRule, WidgetRuleMap } from '@t/editor';
import { getInlineMarkdownText } from '@/utils/markdown';

let widgetRules: WidgetRule[] = [];

const widgetRuleMap: WidgetRuleMap = {};

const reWidgetPrefix = /\$\$widget\d+\s/;

export function unwrapWidgetSyntax(text: string) {
  const index = text.search(reWidgetPrefix);

  if (index !== -1) {
    const rest = text.substring(index);
    const replaced = rest.replace(reWidgetPrefix, '').replace('$$', '');

    text = text.substring(0, index);
    text += unwrapWidgetSyntax(replaced);
  }
  return text;
}

/**
 * Creates a widget string safe for insertion into TUI Editor.
 *
 * TUI Editor wraps widgets with `$$`, and its parser (ToastMark) treats
 * `$$` as a special delimiter. If the widget content itself contains `$$`,
 * ToastMark may incorrectly interpret it as the end of the widget block,
 * breaking rendering or WYSIWYG behavior.
 *
 * This function inserts a zero-width space (`\u200B`) between any `$` characters
 * that form a `$$` sequence inside the widget content. This prevents the
 * parser from prematurely closing the widget while remaining invisible to
 * users in the editor. The resulting string is safe to insert into the editor
 * and will render correctly in WYSIWYG mode.
 *
 * @param info - Metadata or identifier for the widget (e.g., type or ID)
 * @param content - The raw text content of the widget, which may include `$$`
 * @returns A string representing the widget, wrapped in `$$` with internal
 *          `$` sequences made parser-safe
 */
export function createWidgetContent(info: string, content: string) {
  const safeContent = content.replaceAll('$$', `$${'\u200B'}$`);

  return `$$${info} ${safeContent}$$`;
}

export function widgetToDOM(info: string, text: string) {
  const { rule, toDOM } = widgetRuleMap[info];

  const matches = unwrapWidgetSyntax(text).match(rule);

  if (matches) {
    text = matches[0];
  }

  return toDOM(text);
}

export function getWidgetRules() {
  return widgetRules;
}

export function setWidgetRules(rules: WidgetRule[]) {
  widgetRules = rules;
  widgetRules.forEach((rule, index) => {
    widgetRuleMap[`widget${index}`] = rule;
  });
}

function mergeNodes(nodes: ProsemirrorNode[], text: string, schema: Schema, ruleIndex: number) {
  return nodes.concat(createNodesWithWidget(text, schema, ruleIndex));
}

/**
 * create nodes with plain text and replace text matched to the widget rules with the widget node
 * For example, in case the text and widget rules as below
 *
 * text: $test plain text #test
 * widget rules: [{ rule: /$.+/ }, { rule: /#.+/ }]
 *
 * The creating node process is recursive and is as follows.
 *
 * in first widget rule(/$.+/)
 *  $test -> widget node
 *  plain text -> match with next widget rule
 *  #test -> match with next widget rule
 *
 * in second widget rule(/#.+/)
 *  plain text -> text node(no rule for matching)
 *  #test -> widget node
 */
export function createNodesWithWidget(text: string, schema: Schema, ruleIndex = 0) {
  let nodes: ProsemirrorNode[] = [];
  const { rule } = widgetRules[ruleIndex] || {};
  const nextRuleIndex = ruleIndex + 1;

  text = unwrapWidgetSyntax(text);

  if (rule && rule.test(text)) {
    let index;

    while ((index = text.search(rule)) !== -1) {
      const prev = text.substring(0, index);

      // get widget node on first splitted text using next widget rule
      if (prev) {
        nodes = mergeNodes(nodes, prev, schema, nextRuleIndex);
      }

      // build widget node using current widget rule
      text = text.substring(index);

      const [literal] = text.match(rule)!;
      const info = `widget${ruleIndex}`;

      nodes.push(
        schema.nodes.widget.create({ info }, schema.text(createWidgetContent(info, literal)))
      );
      text = text.substring(literal.length);
    }
    // get widget node on last splitted text using next widget rule
    if (text) {
      nodes = mergeNodes(nodes, text, schema, nextRuleIndex);
    }
  } else if (text) {
    nodes =
      ruleIndex < widgetRules.length - 1
        ? mergeNodes(nodes, text, schema, nextRuleIndex)
        : [schema.text(text)];
  }

  return nodes;
}

export function getWidgetContent(widgetNode: CustomInlineMdNode) {
  let event;
  let text = '';
  const walker = widgetNode.walker();

  while ((event = walker.next())) {
    const { node, entering } = event;

    if (entering) {
      if (node !== widgetNode && node.type !== 'text') {
        text += getInlineMarkdownText(node);
        // skip the children
        walker.resumeAt(widgetNode, false);
        walker.next();
      } else if (node.type === 'text') {
        text += node.literal;
      }
    }
  }

  return text;
}
