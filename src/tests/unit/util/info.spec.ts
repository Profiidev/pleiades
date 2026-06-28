import { getSessionMeta } from '$lib/util/info.svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getSessionMeta (User-Agent fallback)', () => {
  afterEach(() => vi.unstubAllGlobals());

  // oxlint-disable-next-line consistent-function-scoping
  const withUa = (userAgent: string) => {
    // No `userAgentData` forces the manual UA-string parsing branch.
    vi.stubGlobal('navigator', { userAgent });
    return getSessionMeta();
  };

  // Each row exercises one OS branch and one browser branch together, plus the
  // Combined `name`/`application` formatting. The UA strings are crafted so the
  // Documented detection order (e.g. X11 before Linux, Mac before iOS) is hit.
  it.each([
    {
      application: 'Firefox 120.0',
      label: 'Windows + Firefox',
      name: 'Firefox Windows',
      os: 'Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
    },
    {
      application: 'Safari 17.1',
      label: 'macOS + Safari with Version token',
      name: 'Safari MacOS',
      os: 'MacOS',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    },
    {
      application: 'Safari 605.1.15',
      label: 'macOS + Safari without Version token',
      name: 'Safari MacOS',
      os: 'MacOS',
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15 Safari/605.1.15'
    },
    {
      application: 'Edge 126.0.0.0',
      label: 'Windows + Edge (EDG before Chrome)',
      name: 'Edge Windows',
      os: 'Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0'
    },
    {
      application: 'Chrome 126.0.0.0',
      label: 'Windows + Chrome',
      name: 'Chrome Windows',
      os: 'Windows',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    },
    {
      application: 'Chrome 125.0.0.0',
      label: 'UNIX (X11 before Linux) + Chrome',
      name: 'Chrome UNIX',
      os: 'UNIX',
      ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    },
    {
      application: 'Firefox 121.0',
      label: 'Linux + Firefox',
      name: 'Firefox Linux',
      os: 'Linux',
      ua: 'Mozilla/5.0 (Linux; rv:121.0) Gecko/20100101 Firefox/121.0'
    },
    {
      application: 'Chrome 126.0.0.0',
      label: 'Android + Chrome',
      name: 'Chrome Android',
      os: 'Android',
      ua: 'Mozilla/5.0 (Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
    },
    {
      application: 'Safari 17.0',
      label: 'iOS + Safari (no Mac token)',
      name: 'Safari iOS',
      os: 'iOS',
      ua: 'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/17.0 Safari/604.1'
    },
    {
      application: 'Internet Explorer 9.0',
      label: 'Windows + IE via MSIE token',
      name: 'Internet Explorer Windows',
      os: 'Windows',
      ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
    },
    {
      application: 'Internet Explorer 11.0',
      label: 'Windows + IE via Trident rv token',
      name: 'Internet Explorer Windows',
      os: 'Windows',
      ua: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
    },
    {
      application: 'Unknown Browser',
      label: 'unknown browser and OS (no version => name only)',
      name: 'Unknown Browser Unknown OS',
      os: 'Unknown OS',
      ua: 'CustomAgent/1.0'
    }
  ])('parses $label', ({ application, name, os, ua }) => {
    expect(withUa(ua)).toEqual({
      application,
      name,
      operating_system: os
    });
  });
});

describe('getSessionMeta (userAgentData)', () => {
  afterEach(() => vi.unstubAllGlobals());

  // oxlint-disable-next-line consistent-function-scoping
  const withUaData = (
    brands: { brand: string; version: string }[],
    platform: string
  ) => {
    vi.stubGlobal('navigator', {
      userAgent: 'ignored-when-uaData-present',
      userAgentData: { brands, mobile: false, platform }
    });
    return getSessionMeta();
  };

  it('uses the first real brand (skipping Chromium and "Not" entries)', () => {
    expect(
      withUaData(
        [
          { brand: 'Chromium', version: '126' },
          { brand: 'Not.A/Brand', version: '24' },
          { brand: 'Google Chrome', version: '126' }
        ],
        'Windows'
      )
    ).toEqual({
      application: 'Google Chrome 126',
      name: 'Google Chrome Windows',
      operating_system: 'Windows'
    });
  });

  it('omits the version when the active brand reports an empty one', () => {
    expect(withUaData([{ brand: 'Firefox', version: '' }], 'Linux')).toEqual({
      application: 'Firefox',
      name: 'Firefox Linux',
      operating_system: 'Linux'
    });
  });

  it('falls back to the first brand when none are "real"', () => {
    expect(
      withUaData(
        [
          { brand: 'Chromium', version: '120' },
          { brand: 'Not)A;Brand', version: '8' }
        ],
        'macOS'
      )
    ).toEqual({
      application: 'Chromium 120',
      name: 'Chromium macOS',
      operating_system: 'macOS'
    });
  });

  it('keeps the unknown defaults when the brand list is empty', () => {
    expect(withUaData([], 'Android')).toEqual({
      application: 'Unknown Browser',
      name: 'Unknown Browser Android',
      operating_system: 'Android'
    });
  });
});
