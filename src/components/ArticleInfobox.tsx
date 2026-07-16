import type { Article } from "../types/article";

interface ArticleInfoboxProps {
  article: Article;
  showImage?: boolean;
  className?: string;
}

export default function ArticleInfobox({ article, showImage = true, className = "" }: ArticleInfoboxProps) {
  return (
    <div className={`wiki-infobox ${className}`}>
      {showImage && article.heroImage && (
        <figure className="aspect-[4/5] border-b wl-border overflow-hidden bg-black/5">
          <img src={article.heroImage} alt={article.imageAlt || ""} className="w-full h-full object-cover" />
        </figure>
      )}
      <div className="p-0">
        <h2 className="wiki-page-title text-base px-3 pt-3 pb-2">{article.title}</h2>
        <dl>
          <dt>Tipo</dt>
          <dd>{article.type || "—"}</dd>

          <dt>Fecha de nacimiento</dt>
          <dd>{article.birthDate || "—"}</dd>

          <dt>Lugar de nacimiento</dt>
          <dd>{article.birthPlace || "—"}</dd>

          {article.deathPlace && (
            <>
              <dt>Fallecimiento</dt>
              <dd>{article.deathPlace}</dd>
            </>
          )}

          <dt>Categoría</dt>
          <dd>{article.category?.name || "—"}</dd>

          {article.coordinates && (
            <>
              <dt>Coordenadas</dt>
              <dd>
                {article.coordinates.lat != null && article.coordinates.lng != null
                  ? `${article.coordinates.lat.toFixed(4)}, ${article.coordinates.lng.toFixed(4)}`
                  : "No disponibles"}
                <span className="block text-[10px] wl-muted mt-0.5">
                  Precisión: {article.coordinates.confidence}
                </span>
              </dd>
            </>
          )}
        </dl>

        {article.tags.length > 0 && (
          <div className="px-3 pb-2">
            <dt className="text-xs font-semibold wl-muted uppercase tracking-wider mb-1.5">Etiquetas</dt>
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <span key={tag.id} className="badge badge-outline badge-xs">{tag.name}</span>
              ))}
            </div>
          </div>
        )}

        {article.sources.length > 0 && (
          <div className="px-3 pb-2">
            <dt className="text-xs font-semibold wl-muted uppercase tracking-wider mb-1">Fuentes</dt>
            <dd className="text-xs wl-muted">{article.sources.length} referencias</dd>
          </div>
        )}

        {article.imageCredit && (
          <p className="text-[10px] wl-muted px-3 pb-3 leading-relaxed">Crédito: {article.imageCredit}</p>
        )}
      </div>
    </div>
  );
}
