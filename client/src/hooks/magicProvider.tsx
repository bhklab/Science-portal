import { Magic as MagicBase } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Magic = MagicBase<OAuthExtension[]>;

type MagicContextType = {
    magic: Magic | null;
};

const MagicContext = createContext<MagicContextType>({
    magic: null
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
    const [magic, setMagic] = useState<Magic | null>(null);

    useEffect(() => {
        const magic = new MagicBase(process.env.REACT_APP_MAGIC_API_KEY as string, {
            network: {
                rpcUrl: 'https://rpc2.sepolia.org',
                chainId: 11155111
            },
            extensions: {
                oauth: new OAuthExtension()
            }
        });

        setMagic(magic as Magic);
    }, []);

    const value = useMemo(() => {
        return {
            magic
        };
    }, [magic]);

    return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
