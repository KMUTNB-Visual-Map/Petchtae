async function getPath(start, end) {
  const res = await fetch(`/api/v1/navigation/path?start=${start}&end=${end}`);
  return res.json();
}
