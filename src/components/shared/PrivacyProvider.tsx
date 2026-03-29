import { createContext, useContext, useState, type ReactNode } from 'react';

interface PrivacyContextType {
    hidden: boolean;
    toggle: () => void;
}

const PrivacyContext = createContext<PrivacyContextType>({ hidden: false, toggle: () => {} });

export default function PrivacyProvider({ children }: { children: ReactNode }) {
    const [hidden, setHidden] = useState(false);
    return (
        <PrivacyContext.Provider value={{ hidden, toggle: () => setHidden(h => !h) }}>
            {children}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    return useContext(PrivacyContext);
}
