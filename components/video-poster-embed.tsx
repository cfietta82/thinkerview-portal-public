type VideoPosterEmbedProps = {
  id: string;
  title: string;
};

export function VideoPosterEmbed({ id, title }: VideoPosterEmbedProps) {
  return (
    <iframe
      className="aspect-video w-full bg-black"
      src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
