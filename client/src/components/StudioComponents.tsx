import React from 'react';
import { Printer } from 'lucide-react';

/**
 * Minimal set of studio components used by the new Studio UI.
 * Each component receives a `props` object that can be edited in the studio.
 */

export const TextBlock: React.FC<{props: {content: string; size?: 'sm' | 'md' | 'lg'; align?: 'right' | 'center' | 'left'}}> = ({props}) => (
  <p className={`text-${props.size ?? 'md'} text-right`}>{props.content}</p>
);

export const ImageBlock: React.FC<{props: {src: string; alt?: string; aspectRatio?: 'square' | 'cover'}}> = ({props}) => (
  <div className={`relative ${props.aspectRatio === 'square' ? 'aspect-square' : 'aspect-[4/3]'} overflow-hidden rounded-xl`}> 
    <img src={props.src} alt={props.alt ?? ''} className="w-full h-full object-cover" />
  </div>
);

export const ButtonBlock: React.FC<{props: {label: string; href?: string; style?: 'primary' | 'secondary'}}> = ({props}) => (
  <a href={props.href ?? '#'} className={`inline-block px-4 py-2 rounded-md font-bold ${props.style === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-cyan-400 text-black'} `}>
    {props.label}
  </a>
);

export const GalleryBlock: React.FC<{props: {images: string[]}}>=({props})=> (
  <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
    {props.images.map((src,i)=>(
      <img key={i} src={src} alt={`gallery-${i}`} className="w-full h-32 object-cover rounded"/>
    ))}
  </div>
);

export const HTMLBlock: React.FC<{props: {html: string}}>=({props})=> (
  <div dangerouslySetInnerHTML={{__html: props.html}} className="prose prose-sm max-w-none" />
);

/**
 * Helper map used by the studio to render a component based on its `type`.
 */
export const componentMap: Record<string, React.FC<any>> = {
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  gallery: GalleryBlock,
  html: HTMLBlock,
};
