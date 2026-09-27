function cloudinaryUrl(url: string, transform: string) {
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${transform}/`);
  }
  return url;
}

export function imageSrc(url: string, width = 720) {
  return cloudinaryUrl(url, `f_auto,q_auto,c_fill,w_${width}`);
}

export function drawingSrc(url: string, width = 720) {
  return cloudinaryUrl(
    url,
    [
      "f_auto",
      "q_auto",
      "c_fit",
      `w_${width}`,
      "e_auto_color",
      "e_vibrance:40",
      "e_saturation:25",
    ].join(","),
  );
}

const stampAngles: Record<string, number> = {
  "imagen-18": 90,
  "imagen-19": 90,
};

export function stampRotation(key?: string) {
  return key ? (stampAngles[key] ?? 0) : 0;
}

export function stampSrc(url: string, width = 720, angle = 0) {
  return cloudinaryUrl(
    url,
    [
      ...(angle ? [`a_${angle}`] : []),
      "f_auto",
      "q_auto",
      "c_fit",
      `w_${width}`,
      "e_auto_color",
      "e_vibrance:40",
      "e_saturation:25",
    ].join(","),
  );
}
