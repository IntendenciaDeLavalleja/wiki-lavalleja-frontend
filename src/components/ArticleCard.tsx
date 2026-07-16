import { Link } from "react-router-dom";
import type { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="wiki-card min-w-0 group">
      <Link to={`/articulos/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden wl-surface-2">
          {article.heroImage && (
            <img
              src={article.heroImage}
              alt={article.imageAlt ?? ""}
              className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          )}
          <span className="absolute top-2 left-2 badge badge-sm wl-surface wl-border font-medium">
            {article.category?.name ?? "Sin categoría"}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/articulos/${article.slug}`}>
          <h3 className="wiki-page-title text-base mb-1 line-clamp-2 group-hover:wl-accent transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs italic wl-muted mb-2 line-clamp-1">{article.subtitle ?? ""}</p>
        <p className="text-sm line-clamp-2 mb-3 leading-relaxed" style={{ color: "var(--wl-muted)" }}>
          {article.summary ?? ""}
        </p>
        <div className="flex items-center justify-end">
          <Link to={`/articulos/${article.slug}`} className="text-xs font-medium wl-accent hover:opacity-80 transition-colors">
            Leer artículo →
          </Link>
        </div>
      </div>
    </article>
  );
}
