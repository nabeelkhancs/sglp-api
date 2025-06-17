import path from "path";

const getImagePath = (img: string) => {
  const URL = path.resolve(__dirname, '..', './BotDocs', img);

  return URL
}

export default getImagePath
