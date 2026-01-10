// Database template servis untuk motor populer di Indonesia
export const motorTemplates = {
  yamaha: {
    name: "Yamaha",
    models: {
      xmax: {
        name: "XMAX 250",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 4000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 4000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 2000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 10000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 10000, unit: "km" },
          {
            id: "kampas_rem_depan",
            name: "Ganti Kampas Rem Depan",
            interval: 10000,
            unit: "km",
          },
          {
            id: "kampas_rem_belakang",
            name: "Ganti Kampas Rem Belakang",
            interval: 10000,
            unit: "km",
          },
          {
            id: "minyak_rem",
            name: "Ganti Minyak Rem",
            interval: 10000,
            unit: "km",
          },
          {
            id: "air_radiator",
            name: "Ganti Air Radiator",
            interval: 10000,
            unit: "km",
          },
        ],
      },
      nmax: {
        name: "NMAX 155",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 4000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 8000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 16000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
          {
            id: "kampas_rem_depan",
            name: "Ganti Kampas Rem Depan",
            interval: 16000,
            unit: "km",
          },
          {
            id: "kampas_rem_belakang",
            name: "Ganti Kampas Rem Belakang",
            interval: 16000,
            unit: "km",
          },
          {
            id: "minyak_rem",
            name: "Ganti Minyak Rem",
            interval: 20000,
            unit: "km",
          },
        ],
      },
      aerox: {
        name: "Aerox 155",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 4000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 8000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 16000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
          {
            id: "kampas_rem_depan",
            name: "Ganti Kampas Rem Depan",
            interval: 16000,
            unit: "km",
          },
          {
            id: "kampas_rem_belakang",
            name: "Ganti Kampas Rem Belakang",
            interval: 16000,
            unit: "km",
          },
        ],
      },
      fazzio: {
        name: "Fazzio",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 4000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 10000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 16000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
      mio: {
        name: "Mio Series",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 10000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 16000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
    },
  },
  honda: {
    name: "Honda",
    models: {
      pcx: {
        name: "PCX 160",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 8000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 16000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
          {
            id: "kampas_rem_depan",
            name: "Ganti Kampas Rem Depan",
            interval: 16000,
            unit: "km",
          },
          {
            id: "kampas_rem_belakang",
            name: "Ganti Kampas Rem Belakang",
            interval: 16000,
            unit: "km",
          },
          {
            id: "minyak_rem",
            name: "Ganti Minyak Rem",
            interval: 16000,
            unit: "km",
          },
        ],
      },
      vario: {
        name: "Vario 160",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 8000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 16000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
      beat: {
        name: "Beat",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 16000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
      scoopy: {
        name: "Scoopy",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 16000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
      adv: {
        name: "ADV 160",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "filter_oli",
            name: "Ganti Filter Oli",
            interval: 8000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 8000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 8000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 16000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 24000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 8000, unit: "km" },
        ],
      },
    },
  },
  suzuki: {
    name: "Suzuki",
    models: {
      nex: {
        name: "Nex II",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 6000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 6000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 12000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 18000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 6000, unit: "km" },
        ],
      },
      address: {
        name: "Address",
        components: [
          {
            id: "oli_mesin",
            name: "Ganti Oli Mesin",
            interval: 2000,
            unit: "km",
          },
          {
            id: "oli_gardan",
            name: "Ganti Oli Gardan",
            interval: 6000,
            unit: "km",
          },
          {
            id: "servis_cvt",
            name: "Pembersihan / Servis CVT",
            interval: 6000,
            unit: "km",
          },
          { id: "roller", name: "Ganti Roller", interval: 12000, unit: "km" },
          { id: "v_belt", name: "Ganti V-Belt", interval: 18000, unit: "km" },
          { id: "busi", name: "Ganti Busi", interval: 6000, unit: "km" },
        ],
      },
    },
  },
};

// Helper function untuk get template berdasarkan brand dan model
export const getMotorTemplate = (brand, model) => {
  const brandData = motorTemplates[brand.toLowerCase()];
  if (!brandData) return null;

  const modelData = brandData.models[model.toLowerCase()];
  if (!modelData) return null;

  return {
    brand: brandData.name,
    model: modelData.name,
    components: modelData.components,
  };
};

// Helper function untuk get semua brands
export const getBrands = () => {
  return Object.keys(motorTemplates).map((key) => ({
    id: key,
    name: motorTemplates[key].name,
  }));
};

// Helper function untuk get models berdasarkan brand
export const getModels = (brand) => {
  const brandData = motorTemplates[brand.toLowerCase()];
  if (!brandData) return [];

  return Object.keys(brandData.models).map((key) => ({
    id: key,
    name: brandData.models[key].name,
  }));
};
