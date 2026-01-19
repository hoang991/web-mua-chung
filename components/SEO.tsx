import React from 'react';
import { Helmet } from 'react-helmet'; // Note: React Helmet needs to be installed, but I will simulate its effect if we can't add dependencies. 
// Assuming environment doesn't strictly allow new pkgs easily, I'll use a direct DOM manipulation effect or just structure it for the user to add. 
// For this strict environment, I will build a custom hook/component that updates document head.

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schema?: Record<string, any>;
}

export const SEOHead: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = 'https://picsum.photos/1200/630', 
  url = window.location.href,
  type = 'website',
  schema 
}) => {
  React.useEffect(() => {
    document.title = title;
    
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
       let element = document.querySelector(`meta[property="${property}"]`);
       if (!element) {
         element = document.createElement('meta');
         element.setAttribute('property', property);
         document.head.appendChild(element);
       }
       element.setAttribute('content', content);
    };

    if (description) {
        setMeta('description', description);
        setOgMeta('og:description', description);
    }
    setOgMeta('og:title', title);
    setOgMeta('og:image', image);
    setOgMeta('og:url', url);
    setOgMeta('og:type', type);

    // Schema JSON-LD
    if (schema) {
        let script = document.querySelector('#json-ld-schema');
        if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld-schema';
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    }

  }, [title, description, image, url, type, schema]);

  return null;
};
