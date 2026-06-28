// oxlint-disable-next-line complexity
export const getSessionMeta = (): SessionMeta => {
  const ua = navigator.userAgent;
  let browser_name = 'Unknown Browser';
  let browser_version: undefined | string = undefined;
  let os = 'Unknown OS';

  if (navigator.userAgentData) {
    const { brands } = navigator.userAgentData;
    const activeBrand = brands.find(
      (b) => b.brand !== 'Chromium' && !b.brand.includes('Not')
    );

    if (activeBrand) {
      browser_name = activeBrand.brand;
      browser_version = activeBrand.version;
    } else if (brands.length > 0) {
      browser_name = brands[0].brand;
      browser_version = brands[0].version;
    }
    os = navigator.userAgentData.platform;

    const application = browser_version
      ? `${browser_name} ${browser_version}`
      : browser_name;

    return {
      application,
      name: `${browser_name} ${os}`,
      operating_system: os
    };
  }

  // -- Detect OS --
  if (ua.includes('Win')) {
    os = 'Windows';
  } else if (ua.includes('Mac')) {
    os = 'MacOS';
  } else if (ua.includes('X11')) {
    os = 'UNIX';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (/Android/.test(ua)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    os = 'iOS';
  }

  // -- Detect Browser & Version --
  let match: RegExpExecArray | undefined = undefined;
  if ((match = /Firefox\/(?<version>\d+(?:\.\d+)*)/.exec(ua) ?? undefined)) {
    browser_name = 'Firefox';
    browser_version = match.groups?.version;
  } else if (
    (match = /EDG\/(?<version>\d+(?:\.\d+)*)/i.exec(ua) ?? undefined)
  ) {
    browser_name = 'Edge';
    browser_version = match.groups?.version;
  } else if (
    (match = /Chrome\/(?<version>\d+(?:\.\d+)*)/.exec(ua) ?? undefined)
  ) {
    browser_name = 'Chrome';
    browser_version = match.groups?.version;
  } else if (
    (match = /Safari\/(?<version>\d+(?:\.\d+)*)/.exec(ua) ?? undefined) &&
    !ua.includes('Chrome')
  ) {
    browser_name = 'Safari';
    // For Safari, the real version is usually tied to the "Version/X.X" token
    const versionMatch = /Version\/(?<version>\d+(?:\.\d+)*)/.exec(ua);
    if (versionMatch?.groups?.version) {
      browser_version = versionMatch.groups.version;
    } else {
      browser_version = match.groups?.version;
    }
  } else if (
    (match = /MSIE\s(?<version>\d+(?:\.\d+)*)/.exec(ua) ?? undefined) ||
    ua.includes('Trident/')
  ) {
    browser_name = 'Internet Explorer';
    const rvMatch = /rv:(?<version>\d+(?:\.\d+)*)/.exec(ua);
    if (rvMatch?.groups?.version) {
      browser_version = rvMatch.groups.version;
    } else if (match?.groups?.version) {
      browser_version = match.groups.version;
    } else {
      browser_version = 'Unknown';
    }
  }

  const application = browser_version
    ? `${browser_name} ${browser_version}`
    : browser_name;

  return {
    application,
    name: `${browser_name} ${os}`,
    operating_system: os
  };
};

export interface SessionMeta {
  name: string;
  application: string;
  operating_system: string;
}
