function normalizeCredentialSegment(segment: string) {
  return encodeURIComponent(
    decodeURIComponent(segment.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")),
  );
}

export function normalizeDatabaseUrl(input: string) {
  const match = input.match(/^postgres(?:ql)?:\/\/([^@]*)@/i);

  if (!match) {
    return input;
  }

  const userInfo = match[1];
  const separatorIndex = userInfo.indexOf(":");

  if (separatorIndex === -1) {
    return input;
  }

  const username = userInfo.slice(0, separatorIndex);
  const password = userInfo.slice(separatorIndex + 1);
  const normalizedUserInfo = `${normalizeCredentialSegment(username)}:${normalizeCredentialSegment(password)}`;

  return input.replace(userInfo, normalizedUserInfo);
}
