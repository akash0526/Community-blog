import { describe, it, expect } from 'vitest';
import { analyzeSeo, generateCleanSlug } from '../lib/seoEngine.js';

describe('analyzeSeo', () => {
  const validArticle = {
    title: 'Why Connection Pooling Matters in Serverless App Routers',
    targetKeyword: 'Connection Pooling',
    metaDescription: 'Connection Pooling guide exploring how to scale database connections in Serverless Next.js App Routers using PgBouncer and connection multiplexing strategies.',
    content: `# Why Connection Pooling Matters in Serverless App Routers

Connection Pooling is critical for modern serverless applications. This guide explains why this technique is essential for scaling database connections effectively. When we talk about database connection management in serverless environments, we need to understand the fundamental challenges that arise.

## Understanding Connection Pooling

Connection Pooling allows multiple clients to share a set of database connections. It reduces the overhead of establishing new connections for each request. In a serverless architecture, this becomes even more crucial because each function invocation may run in an isolated environment. Pools help mitigate the connection storm problem that occurs when hundreds of serverless functions try to connect to the database simultaneously.

## Implementing with PgBouncer

Using Connection Pooling with PgBouncer provides a lightweight solution for managing database connections. This approach uses transaction-level pooling to efficiently distribute connections across multiple serverless functions. Understanding pool configurations like size and timeout settings is essential for optimal performance.

## Best Practices

Connection Pooling requires careful configuration of pool sizes, timeout settings, and connection limits. Strategies vary depending on your specific use case and traffic patterns. Implementing Connection Pooling correctly can dramatically improve your application performance and reliability under load.

## Production Deployments

Production environments require monitoring and optimization of database connection pools. They should be configured with appropriate max connections, idle timeout, and connection timeout values. Production deployments also benefit from connection multiplexing and prepared statement caching.

## Advanced Techniques

Advanced techniques like multiplexing can further improve performance. Multiplexing allows multiple queries to share the same database connection. Mastering Connection Pooling is a fundamental skill for any serious backend engineer working with serverless architectures. Transaction pooling mode is the most common approach. Many production systems rely on Connection Pooling to handle thousands of concurrent users efficiently.

Implementing Connection Pooling effectively is a hallmark of experienced backend engineers who understand the nuances of database connection management at scale. By following these patterns, you can build robust serverless applications that handle thousands of concurrent users without database connection exhaustion.

Reference: [Next.js App Router](https://nextjs.org)
`
  };

  it('should return an object with totalScore, wordCount, and checklist', () => {
    const result = analyzeSeo(validArticle);
    expect(result).toHaveProperty('totalScore');
    expect(result).toHaveProperty('wordCount');
    expect(result).toHaveProperty('checklist');
    expect(Array.isArray(result.checklist)).toBe(true);
  });

  it('should score >= 80 for a well-optimized article', () => {
    const result = analyzeSeo(validArticle);
    expect(result.totalScore).toBeGreaterThanOrEqual(80);
  });

  it('should detect keyword in the title', () => {
    const result = analyzeSeo(validArticle);
    const titleCheck = result.checklist.find(c => c.metric === 'Title Exact Match');
    expect(titleCheck).toBeDefined();
    expect(titleCheck.passed).toBe(true);
  });

  it('should flag missing keyword in title', () => {
    const result = analyzeSeo({ title: 'No Keyword Here', targetKeyword: 'Connection Pooling', metaDescription: '', content: '' });
    const titleCheck = result.checklist.find(c => c.metric === 'Title Exact Match');
    expect(titleCheck.passed).toBe(false);
  });

  it('should pass optimal title length between 40-65 chars', () => {
    const result = analyzeSeo(validArticle);
    const titleLenCheck = result.checklist.find(c => c.metric === 'Headline SERP Length');
    expect(titleLenCheck.passed).toBe(true);
  });

  it('should flag a too-short title', () => {
    const result = analyzeSeo({ title: 'Short', targetKeyword: 'test', metaDescription: '', content: '' });
    const titleLenCheck = result.checklist.find(c => c.metric === 'Headline SERP Length');
    expect(titleLenCheck.passed).toBe(false);
  });

  it('should detect keyword in meta description', () => {
    const result = analyzeSeo(validArticle);
    const metaKwCheck = result.checklist.find(c => c.metric === 'Meta Snippet Exact Match');
    expect(metaKwCheck.passed).toBe(true);
  });

  it('should pass optimal meta description length (120-165)', () => {
    const result = analyzeSeo(validArticle);
    const metaLenCheck = result.checklist.find(c => c.metric === 'Meta SERP Length');
    expect(metaLenCheck.passed).toBe(true);
  });

  it('should detect keyword in first 100 words', () => {
    const result = analyzeSeo(validArticle);
    const hookCheck = result.checklist.find(c => c.metric === 'Introductory Intent Hook');
    expect(hookCheck.passed).toBe(true);
  });

  it('should flag keyword not in first 100 words', () => {
    const result = analyzeSeo({
      title: 'Random Topic',
      targetKeyword: 'Zebra',
      metaDescription: '',
      content: 'Word '.repeat(150) + 'Zebra'
    });
    const hookCheck = result.checklist.find(c => c.metric === 'Introductory Intent Hook');
    expect(hookCheck.passed).toBe(false);
  });

  it('should detect keyword density within 0.8% - 3.5%', () => {
    const result = analyzeSeo(validArticle);
    const densityCheck = result.checklist.find(c => c.metric === 'Topical Keyword Density');
    expect(densityCheck.passed).toBe(true);
  });

  it('should flag too-low keyword density', () => {
    const result = analyzeSeo({
      title: 'Test',
      targetKeyword: 'RarelyMentioned',
      metaDescription: '',
      content: 'Some other unrelated content about something else entirely. '
    });
    const densityCheck = result.checklist.find(c => c.metric === 'Topical Keyword Density');
    expect(densityCheck.passed).toBe(false);
  });

  it('should detect keyword in H2 subheadings', () => {
    const result = analyzeSeo(validArticle);
    const h2Check = result.checklist.find(c => c.metric === 'H2 Semantic Outline');
    expect(h2Check.passed).toBe(true);
  });

  it('should flag missing H2 keyword usage', () => {
    const result = analyzeSeo({
      title: 'Test',
      targetKeyword: 'Unrelated',
      metaDescription: '',
      content: '## Some Random Heading\n\nContent here.'
    });
    const h2Check = result.checklist.find(c => c.metric === 'H2 Semantic Outline');
    expect(h2Check.passed).toBe(false);
  });

  it('should detect external reference links', () => {
    const result = analyzeSeo(validArticle);
    const linkCheck = result.checklist.find(c => c.metric === 'Knowledge Graph References');
    expect(linkCheck.passed).toBe(true);
  });

  it('should flag missing external links', () => {
    const result = analyzeSeo({
      title: 'Test',
      targetKeyword: 'test',
      metaDescription: '',
      content: '## Heading\n\nJust some plain text without any links.'
    });
    const linkCheck = result.checklist.find(c => c.metric === 'Knowledge Graph References');
    expect(linkCheck.passed).toBe(false);
  });

  it('should pass word count threshold of 300+ words', () => {
    const result = analyzeSeo(validArticle);
    const wordCountCheck = result.checklist.find(c => c.metric === 'Comprehensive Depth');
    expect(result.wordCount).toBeGreaterThanOrEqual(300);
    expect(wordCountCheck.passed).toBe(true);
  });

  it('should flag insufficient word count', () => {
    const result = analyzeSeo({
      title: 'Test',
      targetKeyword: 'test',
      metaDescription: '',
      content: 'Short content.'
    });
    const wordCountCheck = result.checklist.find(c => c.metric === 'Comprehensive Depth');
    expect(wordCountCheck.passed).toBe(false);
  });

  it('should handle empty inputs gracefully', () => {
    const result = analyzeSeo({ title: '', targetKeyword: '', metaDescription: '', content: '' });
    expect(result.totalScore).toBe(0);
    expect(result.wordCount).toBe(0);
    expect(result.checklist.length).toBeGreaterThan(0);
  });
});

describe('generateCleanSlug', () => {
  it('should convert title to URL-friendly slug', () => {
    expect(generateCleanSlug('Why Connection Pooling is Mandatory in Modern Serverless App Routers'))
      .toBe('why-connection-pooling-is-mandatory-in-modern-serverless-app-routers');
  });

  it('should lowercase all characters', () => {
    expect(generateCleanSlug('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateCleanSlug('hello   world')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(generateCleanSlug('Hello, World! How are you?')).toBe('hello-world-how-are-you');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(generateCleanSlug('--hello-world--')).toBe('hello-world');
  });

  it('should handle single word', () => {
    expect(generateCleanSlug('Hello')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(generateCleanSlug('')).toBe('');
  });
});