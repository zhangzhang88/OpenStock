'use client';
import { useEffect, useRef } from "react";

const useTradingViewWidget = (
    scriptUrl: string,
    config: Record<string, unknown>,
    height: number | string = 600
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const widgetContainer = container.querySelector<HTMLElement>(
            '.tradingview-widget-container__widget'
        );

        if (!widgetContainer) return;

        // Keep the React-rendered widget container intact. TradingView expects its
        // loader script to be appended next to that container and will populate it.
        while (widgetContainer.firstChild) {
            widgetContainer.removeChild(widgetContainer.firstChild);
        }

        container
            .querySelectorAll('script[data-tradingview-widget-script="true"]')
            .forEach((existingScript) => existingScript.remove());

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.type = 'text/javascript';
        script.async = true;
        script.dataset.tradingviewWidgetScript = 'true';
        script.textContent = JSON.stringify(config);

        container.appendChild(script);

        return () => {
            script.remove();

            while (widgetContainer.firstChild) {
                widgetContainer.removeChild(widgetContainer.firstChild);
            }
        };
    }, [scriptUrl, JSON.stringify(config), height]);

    return containerRef;
};

export default useTradingViewWidget;
