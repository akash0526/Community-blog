import { describe, it, expect } from 'vitest';
import { fallbackArticles } from '../lib/seedData.js';

describe('fallbackArticles (seed data)', () => {
  it('should have 3 articles', () => {
    expect(fallbackArticles.length).toBe(3);
  });

  it('should have unique slugs', () => {
    const slugs = fallbackArticles.map(a => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('should have unique IDs', () => {
    const ids = fallbackArticles.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have all required fields on every article', () => {
    const requiredFields = ['id', 'title', 'slug', 'content', 'category', 'target_keyword', 'meta_description', 'image_url', 'seo_score', 'pageviews', 'profiles'];
    for (const article of fallbackArticles) {
      for (const field of requiredFields) {
        expect(article).toHaveProperty(field);
      }
    }
  });

  it('should have profiles with required subfields', () => {
    for (const article of fallbackArticles) {
      expect(article.profiles).toHaveProperty('full_name');
      expect(article.profiles).toHaveProperty('professional_role');
      expect(article.profiles).toHaveProperty('avatar_url');
    }
  });

  it('should have valid SEO scores (0-100)', () => {
    for (const article of fallbackArticles) {
      expect(article.seo_score).toBeGreaterThanOrEqual(0);
      expect(article.seo_score).toBeLessThanOrEqual(100);
    }
  });

  it('should have non-empty content', () => {
    for (const article of fallbackArticles) {
      expect(article.content.length).toBeGreaterThan(100);
    }
  });

  it('should have valid categories', () => {
    const validCategories = ['Web Development', 'Tech & AI', 'Startups & Growth', 'SEO Strategy'];
    for (const article of fallbackArticles) {
      expect(validCategories).toContain(article.category);
    }
  });

  it('should have unique titles', () => {
    const titles = fallbackArticles.map(a => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});