<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;

/**
 * Minimal HTML sanitizer for user-authored rich text (news content).
 *
 * Whitelist-based: strips scripts, event handlers, and any tag not
 * explicitly allowed, while preserving the safe text-level markup the
 * content editor produces. Uses PHP's DOMDocument, so no external
 * dependency is required.
 */
final class HtmlSanitizer
{
    /**
     * Tags that are safe to render inside news content.
     *
     * @var array<int, string>
     */
    private const ALLOWED_TAGS = [
        'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's',
        'ul', 'ol', 'li', 'div', 'span', 'blockquote',
        'h2', 'h3', 'h4', 'a',
    ];

    /**
     * Tags that are stripped entirely, including their children.
     *
     * @var array<int, string>
     */
    private const DISALLOWED_TAGS = [
        'script', 'style', 'iframe', 'object', 'embed',
        'link', 'meta', 'form', 'input', 'button', 'textarea',
        'select', 'svg', 'math', 'template', 'video', 'audio',
    ];

    /**
     * Sanitize user-supplied HTML, returning safe markup (or the plain text
     * equivalent when parsing fails).
     */
    public static function clean(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $previous = libxml_use_internal_errors(true);

        $dom = new DOMDocument;
        $loaded = $dom->loadHTML(
            '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'
            .'<div id="sanitizer-root">'.$html.'</div>'
            .'</body></html>',
            LIBXML_NOERROR | LIBXML_NOWARNING | LIBXML_NONET
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $loaded) {
            return htmlspecialchars(strip_tags($html), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        $root = self::findRoot($dom);

        if (! $root) {
            return htmlspecialchars(strip_tags($html), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        }

        self::sanitizeNode($root);

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $dom->saveHTML($child);
        }

        return $out;
    }

    private static function findRoot(DOMDocument $dom): ?DOMElement
    {
        foreach ($dom->getElementsByTagName('div') as $div) {
            if ($div->getAttribute('id') === 'sanitizer-root') {
                return $div;
            }
        }

        return null;
    }

    private static function sanitizeNode(DOMNode $node): void
    {
        // Snapshot children before mutating the tree.
        $children = [];
        foreach ($node->childNodes as $child) {
            $children[] = $child;
        }

        foreach ($children as $child) {
            if ($child instanceof DOMText) {
                continue;
            }

            if (! $child instanceof DOMElement) {
                $node->removeChild($child);

                continue;
            }

            $tag = strtolower($child->tagName);

            if (in_array($tag, self::DISALLOWED_TAGS, true)) {
                $node->removeChild($child);

                continue;
            }

            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                // Unwrap unknown/void tags: keep their children, drop the tag
                // (this also removes any event handlers on the element).
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);

                continue;
            }

            self::sanitizeAttributes($child, $tag);
            self::sanitizeNode($child);
        }
    }

    private static function sanitizeAttributes(DOMElement $element, string $tag): void
    {
        // Drop every attribute; whitelist below re-adds only what is safe.
        $names = [];
        foreach ($element->attributes as $attr) {
            $names[] = $attr->name;
        }

        $href = null;
        if ($tag === 'a') {
            $href = $element->getAttribute('href');
        }

        foreach ($names as $name) {
            $element->removeAttribute($name);
        }

        if ($tag === 'a' && is_string($href) && $href !== '') {
            if (preg_match('#^(https?://|mailto:)#i', $href) === 1) {
                $element->setAttribute('href', $href);
                $element->setAttribute('rel', 'noopener noreferrer');
                $element->setAttribute('target', '_blank');
            }
        }
    }
}
