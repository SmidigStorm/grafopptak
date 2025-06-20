import { useState, useEffect } from 'react';

interface DropdownItem {
  id: string;
  navn: string;
  beskrivelse?: string;
  type?: string;
}

interface OpptaksVeiData {
  grunnlag: DropdownItem[];
  kravelementer: DropdownItem[];
  kvotetyper: DropdownItem[];
  rangeringstyper: DropdownItem[];
  loading: boolean;
  error: string | null;
}

export function useOpptaksVeiData(): OpptaksVeiData {
  const [data, setData] = useState<OpptaksVeiData>({
    grunnlag: [],
    kravelementer: [],
    kvotetyper: [],
    rangeringstyper: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [grunnlagRes, kravRes, kvoteRes, rangeringRes] = await Promise.all([
          fetch('/api/grunnlag'),
          fetch('/api/kravelementer'),
          fetch('/api/kvotetyper'),
          fetch('/api/rangeringstyper'),
        ]);

        if (!grunnlagRes.ok || !kravRes.ok || !kvoteRes.ok || !rangeringRes.ok) {
          throw new Error('Feil ved henting av dropdown-data');
        }

        const [grunnlag, kravelementer, kvotetyper, rangeringstyper] = await Promise.all([
          grunnlagRes.json(),
          kravRes.json(),
          kvoteRes.json(),
          rangeringRes.json(),
        ]);

        setData({
          grunnlag,
          kravelementer,
          kvotetyper,
          rangeringstyper,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Feil ved henting av opptaksvei-data:', error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: 'Kunne ikke laste dropdown-data',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
