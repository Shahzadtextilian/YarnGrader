export interface UsterParameter {
  name: string;
  key: string;
  unit: string;
  cols: number[]; // e.g. [5, 25, 50, 75, 95] or [5, 50, 95]
  data: { ne: number; values: number[] }[];
}

// 1. Carded Ring Bobbins & Cones - Weaving and Hosiery
export const cardedRingConesStatistics: UsterParameter[] = [
  {
    name: "CVm - Coefficient of variation of mass [%]",
    key: "CVm",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [10.47, 11.48, 12.54, 13.72, 15.17] },
      { ne: 8.0, values: [11.02, 12.06, 13.12, 14.30, 15.71] },
      { ne: 10.0, values: [11.46, 12.52, 13.60, 14.77, 16.15] },
      { ne: 12.0, values: [11.83, 12.91, 14.00, 15.17, 16.51] },
      { ne: 14.0, values: [12.16, 13.25, 14.35, 15.52, 16.83] },
      { ne: 16.0, values: [12.44, 13.54, 14.65, 15.81, 17.10] },
      { ne: 18.0, values: [12.71, 13.82, 14.94, 16.09, 17.35] },
      { ne: 20.0, values: [12.95, 14.07, 15.19, 16.34, 17.58] },
      { ne: 24.0, values: [13.37, 14.51, 15.64, 16.78, 17.98] },
      { ne: 26.0, values: [13.56, 14.70, 15.84, 16.98, 18.15] },
      { ne: 28.0, values: [13.74, 14.89, 16.02, 17.16, 18.32] },
      { ne: 30.0, values: [13.91, 15.06, 16.20, 17.33, 18.47] },
      { ne: 36.0, values: [14.37, 15.53, 16.68, 17.80, 18.89] },
      { ne: 40.0, values: [14.64, 15.81, 16.96, 18.08, 19.14] }
    ]
  },
  {
    name: "CVm 1m - Coefficient of variation of mass 1m [%]",
    key: "CVm_1m",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [3.48, 4.06, 4.51, 5.12, 5.81] },
      { ne: 10.0, values: [3.56, 4.13, 4.59, 5.21, 5.90] },
      { ne: 12.0, values: [3.58, 4.15, 4.61, 5.24, 5.93] },
      { ne: 14.0, values: [3.61, 4.18, 4.64, 5.27, 5.96] },
      { ne: 18.0, values: [3.65, 4.21, 4.68, 5.31, 6.00] },
      { ne: 20.0, values: [3.67, 4.23, 4.70, 5.34, 6.03] },
      { ne: 24.0, values: [3.70, 4.26, 4.73, 5.37, 6.06] },
      { ne: 30.0, values: [3.74, 4.29, 4.77, 5.42, 6.10] },
      { ne: 36.0, values: [3.76, 4.31, 4.79, 5.44, 6.13] },
      { ne: 40.0, values: [3.78, 4.34, 4.82, 5.47, 6.16] }
    ]
  },
  {
    name: "CVm 3m - Coefficient of variation of mass 3m [%]",
    key: "CVm_3m",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [2.49, 2.98, 3.44, 4.02, 4.66] },
      { ne: 10.0, values: [2.56, 3.04, 3.51, 4.09, 4.73] },
      { ne: 14.0, values: [2.61, 3.09, 3.56, 4.14, 4.78] },
      { ne: 20.0, values: [2.66, 3.14, 3.61, 4.19, 4.83] },
      { ne: 30.0, values: [2.72, 3.19, 3.67, 4.25, 4.89] },
      { ne: 40.0, values: [2.77, 3.24, 3.71, 4.30, 4.93] }
    ]
  },
  {
    name: "CVb CVm - Coefficient of variation of mass, between [%]",
    key: "CVb_CVm",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [0.8, 1.2, 1.9, 2.7, 4.2] },
      { ne: 10.0, values: [0.9, 1.3, 2.0, 2.9, 4.4] },
      { ne: 20.0, values: [1.0, 1.5, 2.2, 3.1, 4.7] },
      { ne: 30.0, values: [1.1, 1.6, 2.3, 3.3, 4.9] },
      { ne: 40.0, values: [1.2, 1.7, 2.4, 3.4, 5.1] }
    ]
  },
  {
    name: "Thin -40% - Thin places -40% [/km]",
    key: "Thin_40",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [6, 17, 32, 61, 154] },
      { ne: 10.0, values: [16, 39, 68, 121, 272] },
      { ne: 14.0, values: [31, 67, 113, 190, 396] },
      { ne: 18.0, values: [51, 100, 164, 267, 523] },
      { ne: 20.0, values: [62, 118, 191, 307, 588] },
      { ne: 24.0, values: [90, 159, 251, 393, 721] },
      { ne: 30.0, values: [139, 227, 350, 532, 924] },
      { ne: 40.0, values: [247, 361, 537, 784, 1272] }
    ]
  },
  {
    name: "Thin -50% - Thin places -50% [/km]",
    key: "Thin_50",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [0, 0, 1, 2, 8] },
      { ne: 10.0, values: [0, 1, 2, 5, 16] },
      { ne: 14.0, values: [1, 2, 4, 9, 25] },
      { ne: 20.0, values: [1, 4, 8, 16, 40] },
      { ne: 24.0, values: [2, 5, 11, 21, 50] },
      { ne: 30.0, values: [3, 8, 17, 29, 67] },
      { ne: 40.0, values: [7, 15, 29, 46, 97] }
    ]
  },
  {
    name: "Thick +35% - Thick places +35% [/km]",
    key: "Thick_35",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [141, 304, 500, 938, 1543] },
      { ne: 10.0, values: [216, 425, 663, 1184, 1869] },
      { ne: 14.0, values: [286, 530, 797, 1381, 2121] },
      { ne: 20.0, values: [386, 670, 970, 1625, 2424] },
      { ne: 24.0, values: [449, 755, 1073, 1766, 2596] },
      { ne: 30.0, values: [542, 875, 1213, 1955, 2823] },
      { ne: 40.0, values: [689, 1056, 1421, 2229, 3144] }
    ]
  },
  {
    name: "Thick +50% - Thick places +50% [/km]",
    key: "Thick_50",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [9, 18, 40, 80, 198] },
      { ne: 10.0, values: [17, 34, 68, 130, 289] },
      { ne: 14.0, values: [28, 52, 97, 179, 370] },
      { ne: 20.0, values: [45, 80, 142, 252, 482] },
      { ne: 24.0, values: [58, 100, 173, 299, 551] },
      { ne: 30.0, values: [79, 132, 219, 370, 650] },
      { ne: 40.0, values: [117, 188, 298, 487, 804] }
    ]
  },
  {
    name: "Neps +140% - Neps +140% [/km]",
    key: "Neps_140",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [61, 156, 289, 509, 1224] },
      { ne: 10.0, values: [136, 299, 517, 866, 1840] },
      { ne: 14.0, values: [231, 460, 757, 1227, 2406] },
      { ne: 20.0, values: [405, 726, 1134, 1777, 3198] },
      { ne: 24.0, values: [539, 916, 1395, 2148, 3699] },
      { ne: 30.0, values: [765, 1219, 1796, 2707, 4419] },
      { ne: 40.0, values: [1203, 1761, 2489, 3650, 5559] }
    ]
  },
  {
    name: "Neps +200% - Neps +200% [/km]",
    key: "Neps_200",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [7, 14, 23, 36, 70] },
      { ne: 10.0, values: [20, 35, 57, 89, 164] },
      { ne: 14.0, values: [39, 64, 104, 163, 287] },
      { ne: 20.0, values: [78, 123, 196, 309, 518] },
      { ne: 24.0, values: [111, 172, 272, 429, 702] },
      { ne: 30.0, values: [172, 257, 405, 639, 1017] },
      { ne: 40.0, values: [303, 434, 676, 1071, 1640] }
    ]
  },
  {
    name: "H - Hairiness",
    key: "H",
    unit: "",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 6.0, values: [8.4, 9.2, 10.3, 11.4, 12.7] },
      { ne: 10.0, values: [7.1, 7.9, 8.8, 9.8, 11.0] },
      { ne: 14.0, values: [6.4, 7.1, 8.0, 8.8, 9.9] },
      { ne: 20.0, values: [5.7, 6.4, 7.1, 7.9, 8.9] },
      { ne: 24.0, values: [5.4, 6.0, 6.8, 7.5, 8.5] },
      { ne: 30.0, values: [5.0, 5.6, 6.3, 7.0, 7.9] },
      { ne: 40.0, values: [4.6, 5.2, 5.8, 6.4, 7.3] }
    ]
  },
  {
    name: "sH - Standard deviation of hairiness",
    key: "sH",
    unit: "",
    cols: [5, 50, 95],
    data: [
      { ne: 6.0, values: [2.2, 2.8, 3.5] },
      { ne: 10.0, values: [1.8, 2.3, 3.0] },
      { ne: 14.0, values: [1.6, 2.1, 2.7] },
      { ne: 20.0, values: [1.5, 1.8, 2.4] },
      { ne: 24.0, values: [1.4, 1.7, 2.2] },
      { ne: 30.0, values: [1.3, 1.6, 2.1] },
      { ne: 40.0, values: [1.1, 1.4, 1.9] }
    ]
  },
  {
    name: "S3u - Sum of Uster hairiness level > 3mm [/100m]",
    key: "S3u",
    unit: "/100m",
    cols: [5, 50, 95],
    data: [
      { ne: 6.0, values: [4750, 7717, 13588] },
      { ne: 10.0, values: [4384, 7134, 12328] },
      { ne: 14.0, values: [4158, 6774, 11563] },
      { ne: 20.0, values: [3932, 6413, 10803] },
      { ne: 24.0, values: [3821, 6235, 10435] },
      { ne: 30.0, values: [3689, 6025, 10000] },
      { ne: 40.0, values: [3526, 5764, 9467] }
    ]
  },
  {
    name: "Dst Cnt - Dust count [/km]",
    key: "Dst_Cnt",
    unit: "/km",
    cols: [5, 50, 95],
    data: [
      { ne: 6.0, values: [2445, 4631, 8689] },
      { ne: 10.0, values: [1137, 2288, 4715] },
      { ne: 14.0, values: [687, 1438, 3152] },
      { ne: 20.0, values: [402, 879, 2057] },
      { ne: 24.0, values: [306, 683, 1653] },
      { ne: 30.0, values: [219, 502, 1266] },
      { ne: 40.0, values: [142, 338, 897] }
    ]
  },
  {
    name: "Tr Cnt - Trash count [/km]",
    key: "Tr_Cnt",
    unit: "/km",
    cols: [5, 50, 95],
    data: [
      { ne: 6.0, values: [14, 59, 460] },
      { ne: 10.0, values: [5, 21, 145] },
      { ne: 14.0, values: [3, 11, 68] },
      { ne: 20.0, values: [1, 5, 30] },
      { ne: 24.0, values: [1, 4, 20] },
      { ne: 30.0, values: [1, 2, 12] },
      { ne: 40.0, values: [0, 1, 6] }
    ]
  }
];

// 2. Combed Ring Bobbins & Cones - Weaving and Hosiery
export const combedRingConesStatistics: UsterParameter[] = [
  {
    name: "CVm - Coefficient of variation of mass [%]",
    key: "CVm",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [9.24, 9.96, 10.72, 11.49, 12.27] },
      { ne: 24.0, values: [9.65, 10.35, 11.09, 11.85, 12.60] },
      { ne: 26.0, values: [9.88, 10.58, 11.31, 12.06, 12.78] },
      { ne: 28.0, values: [10.03, 10.72, 11.44, 12.18, 12.89] },
      { ne: 30.0, values: [10.18, 10.86, 11.57, 12.30, 13.01] },
      { ne: 36.0, values: [10.54, 11.20, 11.89, 12.60, 13.29] },
      { ne: 40.0, values: [10.90, 11.55, 12.21, 12.90, 13.57] },
      { ne: 50.0, values: [11.50, 12.11, 12.73, 13.39, 14.01] },
      { ne: 60.0, values: [12.02, 12.60, 13.18, 13.81, 14.38] },
      { ne: 80.0, values: [12.87, 13.39, 13.91, 14.49, 15.00] },
      { ne: 100.0, values: [13.58, 14.05, 14.50, 15.04, 15.49] },
      { ne: 120.0, values: [14.19, 14.61, 15.01, 15.51, 15.90] }
    ]
  },
  {
    name: "CVm 1m - Coefficient of variation of mass 1m [%]",
    key: "CVm_1m",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [3.10, 3.41, 3.72, 4.01, 4.39] },
      { ne: 30.0, values: [3.25, 3.55, 3.85, 4.15, 4.52] },
      { ne: 40.0, values: [3.36, 3.66, 3.95, 4.25, 4.61] },
      { ne: 60.0, values: [3.53, 3.81, 4.09, 4.40, 4.74] },
      { ne: 80.0, values: [3.65, 3.92, 4.20, 4.50, 4.84] },
      { ne: 100.0, values: [3.75, 4.01, 4.28, 4.59, 4.91] },
      { ne: 120.0, values: [3.83, 4.09, 4.35, 4.66, 4.98] }
    ]
  },
  {
    name: "CVm 3m - Coefficient of variation of mass 3m [%]",
    key: "CVm_3m",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [2.26, 2.54, 2.80, 3.05, 3.43] },
      { ne: 30.0, values: [2.34, 2.62, 2.88, 3.15, 3.51] },
      { ne: 40.0, values: [2.40, 2.68, 2.94, 3.21, 3.56] },
      { ne: 60.0, values: [2.49, 2.76, 3.02, 3.31, 3.65] },
      { ne: 80.0, values: [2.55, 2.82, 3.08, 3.38, 3.71] },
      { ne: 100.0, values: [2.60, 2.87, 3.13, 3.44, 3.76] },
      { ne: 120.0, values: [2.64, 2.91, 3.17, 3.48, 3.80] }
    ]
  },
  {
    name: "CVb CVm - Coefficient of variation of mass, between [%]",
    key: "CVb_CVm",
    unit: "%",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [1.0, 1.4, 2.0, 2.8, 3.6] },
      { ne: 30.0, values: [1.1, 1.5, 2.1, 2.9, 3.7] },
      { ne: 40.0, values: [1.2, 1.6, 2.2, 3.0, 3.8] },
      { ne: 60.0, values: [1.2, 1.7, 2.3, 3.1, 4.0] },
      { ne: 80.0, values: [1.3, 1.8, 2.4, 3.2, 4.1] },
      { ne: 100.0, values: [1.4, 1.8, 2.4, 3.2, 4.2] },
      { ne: 120.0, values: [1.4, 1.9, 2.5, 3.3, 4.3] }
    ]
  },
  {
    name: "Thin -40% - Thin places -40% [/km]",
    key: "Thin_40",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [6, 11, 18, 27, 42] },
      { ne: 30.0, values: [15, 25, 37, 55, 84] },
      { ne: 40.0, values: [27, 43, 63, 93, 139] },
      { ne: 60.0, values: [63, 95, 135, 194, 280] },
      { ne: 80.0, values: [114, 166, 230, 326, 461] },
      { ne: 100.0, values: [182, 257, 348, 488, 678] },
      { ne: 120.0, values: [266, 366, 488, 678, 930] }
    ]
  },
  {
    name: "Thin -50% - Thin places -50% [/km]",
    key: "Thin_50",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [0, 0, 0, 0, 0] },
      { ne: 30.0, values: [0, 0, 1, 1, 2] },
      { ne: 40.0, values: [0, 1, 1, 2, 4] },
      { ne: 60.0, values: [2, 3, 5, 9, 16] },
      { ne: 80.0, values: [5, 8, 14, 24, 43] },
      { ne: 100.0, values: [11, 18, 30, 49, 90] },
      { ne: 120.0, values: [20, 34, 55, 89, 165] }
    ]
  },
  {
    name: "Thick +35% - Thick places +35% [/km]",
    key: "Thick_35",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [68, 98, 139, 205, 293] },
      { ne: 30.0, values: [94, 131, 184, 266, 383] },
      { ne: 40.0, values: [117, 160, 224, 320, 463] },
      { ne: 60.0, values: [161, 214, 297, 414, 605] },
      { ne: 80.0, values: [201, 263, 363, 498, 731] },
      { ne: 100.0, values: [239, 308, 424, 575, 847] },
      { ne: 120.0, values: [276, 351, 481, 646, 955] }
    ]
  },
  {
    name: "Thick +50% - Thick places +50% [/km]",
    key: "Thick_50",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [2, 3, 7, 14, 26] },
      { ne: 30.0, values: [3, 6, 12, 23, 42] },
      { ne: 40.0, values: [5, 9, 17, 33, 58] },
      { ne: 60.0, values: [8, 16, 30, 54, 92] },
      { ne: 80.0, values: [12, 24, 44, 77, 128] },
      { ne: 100.0, values: [17, 33, 58, 102, 165] },
      { ne: 120.0, values: [23, 44, 74, 127, 204] }
    ]
  },
  {
    name: "Neps +140% - Neps +140% [/km]",
    key: "Neps_140",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [36, 61, 99, 174, 299] },
      { ne: 30.0, values: [53, 88, 142, 243, 403] },
      { ne: 40.0, values: [69, 115, 184, 309, 499] },
      { ne: 60.0, values: [100, 166, 264, 432, 672] },
      { ne: 80.0, values: [130, 217, 340, 548, 831] },
      { ne: 100.0, values: [160, 266, 415, 660, 980] },
      { ne: 120.0, values: [189, 315, 487, 767, 1121] }
    ]
  },
  {
    name: "Neps +200% - Neps +200% [/km]",
    key: "Neps_200",
    unit: "/km",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [8, 15, 28, 47, 84] },
      { ne: 30.0, values: [11, 20, 36, 62, 109] },
      { ne: 40.0, values: [14, 25, 43, 76, 131] },
      { ne: 60.0, values: [19, 32, 56, 100, 171] },
      { ne: 80.0, values: [23, 40, 67, 121, 206] },
      { ne: 100.0, values: [28, 46, 77, 141, 237] },
      { ne: 120.0, values: [32, 52, 86, 160, 267] }
    ]
  },
  {
    name: "H - Hairiness",
    key: "H",
    unit: "",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [4.8, 5.3, 5.8, 6.4, 7.0] },
      { ne: 30.0, values: [3.8, 4.2, 4.6, 5.0, 5.5] },
      { ne: 40.0, values: [3.2, 3.5, 3.9, 4.2, 4.7] },
      { ne: 60.0, values: [2.6, 2.8, 3.1, 3.3, 3.7] },
      { ne: 80.0, values: [2.2, 2.4, 2.6, 2.8, 3.1] },
      { ne: 100.0, values: [1.9, 2.1, 2.3, 2.5, 2.7] },
      { ne: 120.0, values: [1.7, 1.9, 2.1, 2.2, 2.4] }
    ]
  },
  {
    name: "sH - Standard deviation of hairiness",
    key: "sH",
    unit: "",
    cols: [5, 25, 50, 75, 95],
    data: [
      { ne: 20.0, values: [1.1, 1.2, 1.4, 1.5, 1.8] },
      { ne: 30.0, values: [0.9, 1.0, 1.1, 1.2, 1.4] },
      { ne: 40.0, values: [0.7, 0.8, 0.9, 1.1, 1.2] },
      { ne: 60.0, values: [0.6, 0.7, 0.8, 0.9, 1.0] },
      { ne: 80.0, values: [0.5, 0.6, 0.7, 0.7, 0.8] },
      { ne: 100.0, values: [0.5, 0.5, 0.6, 0.7, 0.7] },
      { ne: 120.0, values: [0.4, 0.5, 0.5, 0.6, 0.7] }
    ]
  },
  {
    name: "S3u - Sum of Uster hairiness level > 3mm [/100m]",
    key: "S3u",
    unit: "/100m",
    cols: [5, 50, 95],
    data: [
      { ne: 20.0, values: [3832, 5115, 6787] },
      { ne: 30.0, values: [2910, 4011, 5501] },
      { ne: 40.0, values: [2394, 3375, 4740] },
      { ne: 60.0, values: [1818, 2646, 3842] },
      { ne: 80.0, values: [1496, 2227, 3310] },
      { ne: 100.0, values: [1286, 1948, 2949] },
      { ne: 120.0, values: [1136, 1746, 2683] }
    ]
  },
  {
    name: "Dst Cnt - Dust count [/km]",
    key: "Dst_Cnt",
    unit: "/km",
    cols: [5, 50, 95],
    data: [
      { ne: 20.0, values: [48, 141, 547] },
      { ne: 30.0, values: [19, 54, 195] },
      { ne: 40.0, values: [10, 27, 94] },
      { ne: 60.0, values: [4, 10, 33] },
      { ne: 80.0, values: [2, 5, 16] },
      { ne: 100.0, values: [1, 3, 9] },
      { ne: 120.0, values: [1, 2, 6] }
    ]
  }
];

// Helper to scale combed values to represent combed cones (Winding/Clearer filters out 15%-30% defects!)
function scaleCombedForCones(param: UsterParameter): UsterParameter {
  const clonedData = param.data.map(d => {
    let scalar = 1.0;
    // Mass properties are slightly uniformer due to high-speed electronic sensors
    if (param.key === "CVm") scalar = 0.98;
    else if (param.key.startsWith("CVm_")) scalar = 0.985;
    // Imperfections (Thin, Thick, Neps) are substantially lower as clearing cuts them out
    else if (param.key.startsWith("Thin_")) scalar = 0.75;
    else if (param.key.startsWith("Thick_")) scalar = 0.80;
    else if (param.key.startsWith("Neps_")) scalar = 0.70;
    // Hairiness Sum and Impurities are also slightly cleaned
    else if (param.key === "S3u") scalar = 0.90;
    else if (param.key === "Dst_Cnt") scalar = 0.85;

    return {
      ne: d.ne,
      values: d.values.map(val => Math.round(val * scalar * 100) / 100)
    };
  });

  return {
    ...param,
    data: clonedData
  };
}

// 3. Combed Cones - Weaving and Hosiery (Cleaned by electronic winding clearers)
export const combedConesStatistics: UsterParameter[] = combedRingConesStatistics.map(p => scaleCombedForCones(p));

/**
 * Dynamically adjust Uster threshold values based on package stage (Bobbins vs Cones)
 * and end-use application (Weaving vs Hosiery/Knitting).
 * Raw master arrays in statistics represent Cones and Weaving.
 */
export function getDynamicParameter(
  param: UsterParameter,
  packageForm: "bobbins" | "cones",
  endUse: "weaving" | "hosiery"
): UsterParameter {
  return {
    ...param,
    data: param.data.map((d) => {
      let mCvm = 1.0;
      let mImperfections = 1.0;
      let mHairiness = 1.0;
      let mImpurities = 1.0;

      // 1. Bobbins vs Cones
      // Bobbins have more imperfections/trash but less hairiness (no drum friction yet)
      if (packageForm === "bobbins") {
        mCvm *= 1.025;
        mImperfections *= 1.35;
        mHairiness *= 0.85;
        mImpurities *= 1.25;
      }

      // 2. Weaving vs Hosiery (Knitting)
      // Hosiery yarns are soft-twisted: higher hairiness, slightly more mass variation
      if (endUse === "hosiery") {
        mCvm *= 1.035;
        mImperfections *= 1.15;
        mHairiness *= 1.20;
      }

      const scaledValues = d.values.map((val) => {
        let f = 1.0;
        if (param.key === "CVm" || param.key.startsWith("CVm_")) {
          f = mCvm;
        } else if (
          param.key.startsWith("Thin_") ||
          param.key.startsWith("Thick_") ||
          param.key.startsWith("Neps_") ||
          param.key === "CVb_CVm"
        ) {
          f = mImperfections;
        } else if (param.key === "H" || param.key === "sH" || param.key === "S3u") {
          f = mHairiness;
        } else if (param.key === "Dst_Cnt" || param.key === "Tr_Cnt") {
          f = mImpurities;
        }

        // Keep values formatted neatly based on magnitude
        const computed = val * f;
        return computed < 3.0
          ? Math.round(computed * 100) / 100
          : computed < 20.0
          ? Math.round(computed * 10) / 10
          : Math.round(computed);
      });

      return {
        ne: d.ne,
        values: scaledValues
      };
    })
  };
}

// Categorized standard count dropdown configurations
export const CARDED_RING_CONES_COUNTS = [6.0, 8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0, 24.0, 26.0, 28.0, 30.0, 36.0, 40.0];
export const COMBED_RING_CONES_COUNTS = [20.0, 24.0, 26.0, 28.0, 30.0, 36.0, 40.0, 50.0, 60.0, 80.0, 100.0, 120.0];
export const COMBED_CONES_COUNTS = [20.0, 24.0, 26.0, 28.0, 30.0, 36.0, 40.0, 50.0, 60.0, 80.0, 100.0, 120.0];

/**
 * Perform a standard linear interpolation to find an estimate on any parameter.
 * Also handles standard out of bound values gracefully.
 */
export function interpolateValue(x: number, x0: number, x1: number, y0: number, y1: number): number {
  if (x1 === x0) return y0;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

/**
 * Lookup the percentiles for a given count (Ne) in the dataset,
 * interpolating values between count steps if necessary.
 */
export function getPercentilesForCount(
  param: UsterParameter,
  ne: number
): { cols: number[]; values: number[] } {
  const data = param.data;
  if (data.length === 0) {
    return { cols: param.cols, values: [] };
  }

  // Exact match
  const exact = data.find(d => Math.abs(d.ne - ne) < 1e-4);
  if (exact) {
    return { cols: param.cols, values: exact.values };
  }

  // Under limit
  if (ne <= data[0].ne) {
    return { cols: param.cols, values: data[0].values };
  }

  // Over limit
  if (ne >= data[data.length - 1].ne) {
    return { cols: param.cols, values: data[data.length - 1].values };
  }

  // Find bounding steps
  let lower = data[0];
  let upper = data[data.length - 1];

  for (let i = 0; i < data.length - 1; i++) {
    if (ne >= data[i].ne && ne <= data[i + 1].ne) {
      lower = data[i];
      upper = data[i + 1];
      break;
    }
  }

  // Interpolate each percentile value
  const values: number[] = [];
  for (let i = 0; i < param.cols.length; i++) {
    const valObj = interpolateValue(ne, lower.ne, upper.ne, lower.values[i], upper.values[i]);
    // round to 2 decimals
    values.push(Math.round(valObj * 100) / 100);
  }

  return { cols: param.cols, values };
}

/**
 * Translate a measured value into an approximate Uster percentile (from 0 to 100).
 * Lower percentile means better quality (only that % of spinning mills can reach it!).
 */
export function gradeYarnParameter(
  param: UsterParameter,
  ne: number,
  measuredValue: number
): {
  percentile: number;
  label: string; // e.g. "5%", "5% - 25%", "25% - 50%", "50% - 75%", "75% - 95%", "95%", etc.
  grade: "Excellent" | "Good" | "Average" | "Below Average" | "Poor";
  percentiles: number[];
  cols: number[];
} {
  const { cols, values } = getPercentilesForCount(param, ne);
  if (values.length === 0) {
    return {
      percentile: 50,
      label: "N/A",
      grade: "Average",
      percentiles: [],
      cols: []
    };
  }

  // Determine direction: is higher value better or worse?
  // In almost all textile parameters, higher variation/defects is worse, so lower is better.
  const isHigherWorse = true; // standard for yarn quality defects / variation

  // Look up index of the bounding percentiles
  let p = 50;
  let label = "50%";
  let grade: "Excellent" | "Good" | "Average" | "Below Average" | "Poor" = "Average";

  if (cols.length === 5) {
    // Columns are 5, 25, 50, 75, 95
    const [v5, v25, v50, v75, v95] = values;

    if (measuredValue <= v5) {
      // Outstanding quality
      p = interpolateValue(measuredValue, 0, v5, 1, 5);
      p = Math.max(1, Math.round(p));
      label = "< 5%";
      grade = "Excellent";
    } else if (measuredValue <= v25) {
      p = interpolateValue(measuredValue, v5, v25, 5, 25);
      p = Math.round(p);
      label = "5% - 25%";
      grade = "Good";
    } else if (measuredValue <= v50) {
      p = interpolateValue(measuredValue, v25, v50, 25, 50);
      p = Math.round(p);
      label = "25% - 50%";
      grade = "Average";
    } else if (measuredValue <= v75) {
      p = interpolateValue(measuredValue, v50, v75, 50, 75);
      p = Math.round(p);
      label = "50% - 75%";
      grade = "Below Average";
    } else if (measuredValue <= v95) {
      p = interpolateValue(measuredValue, v75, v95, 75, 95);
      p = Math.round(p);
      label = "75% - 95%";
      grade = "Poor";
    } else {
      // Extremely poor
      p = interpolateValue(measuredValue, v95, v95 * 1.5, 95, 99);
      p = Math.min(99, Math.round(p));
      label = "> 95%";
      grade = "Poor";
    }
  } else {
    // Columns are 5, 50, 95 (for standard deviations & counts only)
    const [v5, v50, v95] = values;

    if (measuredValue <= v5) {
      p = interpolateValue(measuredValue, 0, v5, 1, 5);
      p = Math.max(1, Math.round(p));
      label = "< 5%";
      grade = "Excellent";
    } else if (measuredValue <= v50) {
      p = interpolateValue(measuredValue, v5, v50, 5, 50);
      p = Math.round(p);
      label = "5% - 50%";
      grade = "Good";
    } else if (measuredValue <= v95) {
      p = interpolateValue(measuredValue, v50, v95, 50, 95);
      p = Math.round(p);
      label = "50% - 95%";
      grade = "Below Average";
    } else {
      p = interpolateValue(measuredValue, v95, v95 * 1.5, 95, 99);
      p = Math.min(99, Math.round(p));
      label = "> 95%";
      grade = "Poor";
    }
  }

  return {
    percentile: p,
    label,
    grade,
    percentiles: values,
    cols
  };
}
