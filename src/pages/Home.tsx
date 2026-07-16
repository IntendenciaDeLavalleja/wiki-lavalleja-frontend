import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getArticles,
  getCategories,
  getSiteSettings,
  resolveMediaUrl,
  type ArticleSummary,
  type ArticleListResponse,
  type Category,
  type SiteSettings,
} from "../lib/api";
import SearchBox from "../components/SearchBox";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catFilter = searchParams.get("cat") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, refetch } = useQuery<ArticleListResponse>({
    queryKey: ["articles", debouncedSearch, catFilter, page],
    queryFn: () => getArticles({
      q: debouncedSearch || undefined,
      category: catFilter || undefined,
      page,
      perPage: 12,
      sort: "newest",
    }),
  });

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) params.set("page", String(newPage));
    else params.delete("page");
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSearchChange = useCallback(() => {
    setSearchParams(prev => {
      prev.delete("page");
      return prev;
    });
  }, [setSearchParams]);

  const articles = data?.items || [];
  const pagination = data?.pagination;
  const selectedCategory = categories.find((category) => category.slug === catFilter);
  const headerImage = siteSettings?.headerImage
    ? resolveMediaUrl(siteSettings.headerImage)
    : "https://commons.wikimedia.org/wiki/Special:FilePath/Minas%20Uruguay.jpg";

  return (
    <div>
      <section className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={headerImage}
          alt={siteSettings?.headerImageAlt || "Vista de Minas, Uruguay"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 wl-hero-overlay" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 lg:px-12 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="wiki-page-title text-3xl md:text-4xl">WikiLavalleja</h1>
              <span className="badge badge-sm wl-accent wl-border">archivo vivo</span>
            </div>
            <p className="text-sm md:text-base wl-muted leading-relaxed max-w-xl">
              Una wiki simple para preservar personajes, calles, lugares y hechos de interés histórico-cultural de Lavalleja.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full min-w-0 max-w-5xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <SearchBox
            value={search}
            onChange={(v) => { setSearch(v); handleSearchChange(); }}
            placeholder="Buscar por título, calle, categoría o etiqueta..."
            className="flex-1 max-w-md"
          />
          {catFilter && (
            <Link to="/" className="btn btn-ghost btn-xs gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtro
            </Link>
          )}
        </div>

        {categories.length > 0 && (
          <div className="grid w-full min-w-0 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {categories.map((category) => {
            const href = `/?cat=${encodeURIComponent(category.slug)}`;
            return (
              <Link
                key={category.id}
                to={href}
                  className={`wiki-card min-w-0 p-3 text-center hover:border-[var(--wl-accent)] transition-colors ${
                  catFilter === category.slug ? "ring-1 ring-[var(--wl-accent)]" : ""
                }`}
              >
                <span className="text-xl mb-1 block" aria-hidden="true">{category.emoji}</span>
                <span className="text-xs font-medium wl-muted leading-tight break-words block">{category.name}</span>
              </Link>
            );
          })}
        </div>
        )}

        <div id="articulos" className="flex min-w-0 items-center justify-between gap-3 mb-4">
          <h2 className="wiki-page-title min-w-0 text-xl">
            {catFilter ? `Categoría: ${selectedCategory?.name || catFilter}` : "Todos los artículos"}
          </h2>
          <span className="shrink-0 text-xs wl-muted">{pagination?.total || 0} artículos</span>
        </div>

        {isLoading ? (
          <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wiki-card">
                <div className="skeleton aspect-[16/9] w-full rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-16" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12" aria-live="polite">
            <p className="wl-muted text-lg mb-4">No se pudo conectar con el servidor.</p>
            <button onClick={() => refetch()} className="btn btn-primary btn-sm">Reintentar</button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="wl-muted text-lg">
              No se encontraron artículos{debouncedSearch ? ` para "${debouncedSearch}"` : ""}.
            </p>
          </div>
        ) : (
          <>
            <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Paginación">
                {pagination.hasPrevious && (
                  <button onClick={() => handlePageChange(page - 1)} className="px-3 py-1 text-sm border wl-border rounded-lg hover:wl-surface-2">
                    Anterior
                  </button>
                )}
                <span className="text-sm wl-muted">Página {pagination.page} de {pagination.pages}</span>
                {pagination.hasNext && (
                  <button onClick={() => handlePageChange(page + 1)} className="px-3 py-1 text-sm border wl-border rounded-lg hover:wl-surface-2">
                    Siguiente
                  </button>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleSummary }) {
  const heroImage = article.heroImage ? resolveMediaUrl(article.heroImage) : null;
  return (
    <article className="wiki-card min-w-0 group">
      <Link to={`/articulos/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden wl-surface-2">
          {heroImage && (
            <img
              src={heroImage}
              alt={article.imageAlt || ""}
              className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
            />
          )}
          <span className="absolute top-2 left-2 badge badge-sm wl-surface wl-border font-medium">
            {article.category?.name || "Sin categoría"}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/articulos/${article.slug}`}>
          <h3 className="wiki-page-title text-base mb-1 line-clamp-2 group-hover:wl-accent transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs italic wl-muted mb-2 line-clamp-1">{article.subtitle || ""}</p>
        <p className="text-sm line-clamp-2 mb-3 leading-relaxed" style={{ color: "var(--wl-muted)" }}>
          {article.summary || ""}
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
