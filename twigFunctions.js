export const asset = (value, manifest) => {
  if (manifest !== undefined) {
    return manifest[value];
  }
  return value;
}

export const path = (value, data) => {
  const storyIndex = value.substring(value.lastIndexOf('_') + 1);
  const pathName = value.substring(0, value.lastIndexOf('_'));
  const storyName = pathName.substring(pathName.lastIndexOf('_') + 1);

  if (storyName && storyIndex) {
    return `?selectedKind=${storyName}&selectedStory=${storyIndex}.html`;
  }
  return '#';
}

export const csrf_token = value => {
  return value + "token";
}