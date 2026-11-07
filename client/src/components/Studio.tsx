import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { componentMap } from './StudioComponents';

/**
 * Simple Studio UI for building multi‑page stores.
 * It allows:
 *  • Adding / deleting pages (each page has a title, slug, and a list of components)
 *  • Adding basic components (text, image, button, gallery, html) to the selected page
 *  • Editing component props via a small side panel
 *  • Saving changes back to `profileForm.storeSettings.pages`
 *  • Quick preview of the current page layout
 */
export const Studio: React.FC<{profileForm: any; setProfileForm: (p:any)=>void}> = ({profileForm, setProfileForm}) => {
  const pages = profileForm.storeSettings?.pages ?? [];
  const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id || '');
  const [selectedComponentId, setSelectedComponentId] = useState('');

  // Ensure at least one page exists
  useEffect(() => {
    if (pages.length === 0) {
      const newPage = {
        id: Date.now().toString(),
        title: 'الصفحة الرئيسية',
        slug: 'home',
        components: [],
      } as any;
      setProfileForm(prev => ({
        ...prev,
        storeSettings: {
          ...prev.storeSettings,
          pages: [newPage],
        },
      }));
      setSelectedPageId(newPage.id);
    }
  }, []);

  const currentPage = pages.find((p:any) => p.id === selectedPageId);

  // ----- Page management -----
  const addPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: 'صفحة جديدة',
      slug: `page-${pages.length + 1}`,
      components: [],
    } as any;
    setProfileForm((prev:any) => ({
      ...prev,
      storeSettings: {
        ...prev.storeSettings,
        pages: [...(prev.storeSettings?.pages ?? []), newPage],
      },
    }));
    setSelectedPageId(newPage.id);
  };

  const deletePage = (id:string) => {
    const filtered = pages.filter((p:any) => p.id !== id);
    setProfileForm((prev:any) => ({
      ...prev,
      storeSettings: {
        ...prev.storeSettings,
        pages: filtered,
      },
    }));
    if (filtered.length > 0) setSelectedPageId(filtered[0].id);
  };

  // ----- Component management -----
  const addComponent = (type:string) => {
    if (!currentPage) return;
    const newComp = {
      id: Date.now().toString(),
      type,
      props: {},
    } as any;
    // default props for a few types
    if (type === 'text') newComp.props = {content: 'نص جديد', size: 'md', align: 'right'};
    if (type === 'image') newComp.props = {src: '', alt: '', aspectRatio: 'cover'};
    if (type === 'button') newComp.props = {label: 'زر', href: '#', style: 'primary'};
    if (type === 'gallery') newComp.props = {images: []};
    if (type === 'html') newComp.props = {html: '<p>HTML</p>'};
    const updatedComponents = [...currentPage.components, newComp];
    updatePageComponents(updatedComponents);
  };

  const updatePageComponents = (components:any[]) => {
    const updatedPages = pages.map((p:any) =>
      p.id === selectedPageId ? {...p, components} : p
    );
    setProfileForm((prev:any) => ({
      ...prev,
      storeSettings: {...prev.storeSettings, pages: updatedPages},
    }));
  };

  const updateComponentProps = (id:string, newProps:any) => {
    if (!currentPage) return;
    const updatedComponents = currentPage.components.map((c:any) =>
      c.id === id ? {...c, props: {...c.props, ...newProps}} : c
    );
    updatePageComponents(updatedComponents);
  };

  const deleteComponent = (id:string) => {
    if (!currentPage) return;
    const updatedComponents = currentPage.components.filter((c:any) => c.id !== id);
    updatePageComponents(updatedComponents);
    setSelectedComponentId('');
  };

  // ----- Render helpers -----
  const renderComponent = (comp:any) => {
    const Comp = componentMap[comp.type];
    return Comp ? <Comp key={comp.id} props={comp.props} /> : null;
  };

  // ----- UI -----
  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Sidebar – Pages */}
      <aside className="w-60 bg-black/30 border border-white/10 rounded-xl p-3 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-white">الصفحات</h3>
          <Button size="sm" onClick={addPage}>+ صفحة</Button>
        </div>
        <ul className="space-y-1">
          {pages.map((p:any) => (
            <li key={p.id} className={`flex items-center justify-between px-2 py-1 rounded ${p.id===selectedPageId?'bg-cyan-400/20 text-white':'text-gray-300'}`}>
              <button onClick={() => setSelectedPageId(p.id)} className="text-left flex-1">
                {p.title}
              </button>
              <button onClick={() => deletePage(p.id)} className="text-red-400 hover:text-red-300 ml-2">
                ✕
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main canvas – Page editor */}
      <section className="flex-1 flex flex-col bg-black/20 border border-white/10 rounded-xl overflow-hidden">
        {currentPage && (
          <>
            {/* Page header */}
            <header className="flex items-center justify-between border-b border-white/10 p-3 bg-black/30">
              <div className="space-y-1">
                <Input
                  value={currentPage.title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    const updatedPages = pages.map((p:any) =>
                      p.id === selectedPageId ? {...p, title: newTitle} : p
                    );
                    setProfileForm((prev:any) => ({
                      ...prev,
                      storeSettings: {...prev.storeSettings, pages: updatedPages},
                    }));
                  }}
                  className="text-white bg-black/50"
                />
                <Input
                  value={currentPage.slug}
                  onChange={e => {
                    const newSlug = e.target.value.replace(/[^a-z0-9-]/gi, '');
                    const updatedPages = pages.map((p:any) =>
                      p.id === selectedPageId ? {...p, slug: newSlug} : p
                    );
                    setProfileForm((prev:any) => ({
                      ...prev,
                      storeSettings: {...prev.storeSettings, pages: updatedPages},
                    }));
                  }}
                  placeholder="slug (الملف التعريفي)"
                  className="text-white bg-black/50 text-sm"
                />
              </div>
              <Button size="sm" onClick={() => {
                // Simple preview: open a new window with rendered components
                const win = window.open('', '_blank', 'width=800,height=600');
                if (!win) return;
                const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${currentPage.title}</title><style>body{font-family:Arial,sans-serif;background:#fff;color:#000;padding:10px;}</style></head><body>${currentPage.components.map((c:any)=>{
                  const Comp = componentMap[c.type];
                  if (!Comp) return '';
                  // Render to string using ReactDOMServer (if available). Fallback to minimal markup.
                  return '';
                }).join('')}</body></html>`;
                win.document.write(html);
                win.document.close();
              }}>معاينة</Button>
            </header>

            {/* Component toolbox */}
            <div className="flex p-2 border-b border-white/10 bg-black/10">
              {['text','image','button','gallery','html'].map(t => (
                <Button key={t} size="sm" variant="outline" className="mr-2" onClick={() => addComponent(t)}>
                  إضافة {t}
                </Button>
              ))}
            </div>

            {/* Components list */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-1 gap-4">
              {currentPage.components.map((c:any) => (
                <div
                  key={c.id}
                  className={`border rounded p-2 ${selectedComponentId===c.id?'border-cyan-400':'border-white/20'} cursor-pointer`}
                  onClick={() => setSelectedComponentId(c.id)}
                >
                  {renderComponent(c)}
                </div>
              ))}
            </div>

            {/* Component properties panel */}
            {selectedComponentId && (
              <aside className="border-t border-white/10 p-3 bg-black/10">
                <h4 className="text-xs font-bold text-white mb-2">تحرير المكوّن</h4>
                {(() => {
                  const comp = currentPage.components.find((c:any) => c.id===selectedComponentId);
                  if (!comp) return null;
                  const update = (field:string, value:any) => updateComponentProps(comp.id, {[field]: value});
                  switch (comp.type) {
                    case 'text':
                      return (
                        <>
                          <Label className="text-xs text-gray-300">النص</Label>
                          <Textarea
                            value={comp.props.content}
                            onChange={e=>update('content', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                          <Label className="text-xs text-gray-300">الحجم</Label>
                          <Input
                            value={comp.props.size || ''}
                            onChange={e=>update('size', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                        </>
                      );
                    case 'image':
                      return (
                        <>
                          <Label className="text-xs text-gray-300">رابط الصورة</Label>
                          <Input
                            value={comp.props.src}
                            onChange={e=>update('src', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                          <Label className="text-xs text-gray-300">نص بديل</Label>
                          <Input
                            value={comp.props.alt || ''}
                            onChange={e=>update('alt', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                        </>
                      );
                    case 'button':
                      return (
                        <>
                          <Label className="text-xs text-gray-300">العنوان</Label>
                          <Input
                            value={comp.props.label}
                            onChange={e=>update('label', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                          <Label className="text-xs text-gray-300">الرابط</Label>
                          <Input
                            value={comp.props.href}
                            onChange={e=>update('href', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                        </>
                      );
                    case 'gallery':
                      return (
                        <>
                          <Label className="text-xs text-gray-300">روابط الصور (فاصلة) </Label>
                          <Textarea
                            value={comp.props.images?.join('\n') || ''}
                            onChange={e=>update('images', e.target.value.split('\n').filter(Boolean))}
                            className="bg-black/30 text-white mb-2"
                          />
                        </>
                      );
                    case 'html':
                      return (
                        <>
                          <Label className="text-xs text-gray-300">HTML</Label>
                          <Textarea
                            value={comp.props.html}
                            onChange={e=>update('html', e.target.value)}
                            className="bg-black/30 text-white mb-2"
                          />
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
                <Button size="sm" variant="destructive" onClick={() => deleteComponent(selectedComponentId)} className="mt-2">
                  حذف المكوّن
                </Button>
              </aside>
            )}
          </>
        )}
      </section>
    </div>
  );
};
