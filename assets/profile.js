/**
 * Central profile configuration for alexander-src.github.io and cv.html.
 * Update displayName, location, email, linkedinUrl, and mergedPullRequests here.
 */
window.PORTFOLIO_PROFILE = {
  displayName: "Alexander",
  handle: "alexander-src",
  roleTitle: "Systems Software Engineer",
  location: "Open to remote and global roles",
  availability: "Available for software engineering and systems roles",
  email: "alex.laros@proton.me",
  githubUrl: "https://github.com/alexander-src",
  portfolioUrl: "https://alexander-src.github.io",
  linkedinUrl: "",

  /**
   * Add merged upstream open-source PRs here once they land under @alexander-src.
   * Each entry requires: repo, prNumber, title, url, impact.
   */
  mergedPullRequests: [
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 26148,
      title: "perf(tools): fast-scan C++ sources and calls in export_gap",
      url: "https://github.com/boykopovar/AnyPS5/pull/26148",
      impact: "Cut export_gap.py collect_provided 4.67x (8.66s to 1.85s across 413 PRX modules) and find_self_calls 3.98x with identical SHA-256 outputs, 73,000 differential fuzz checks (0 mismatches), and full CPython 3.12-3.15 Path.suffix compatibility."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 840,
      title: "test(shader): extend int16 ternary matrix for all orderings, ties and med3 chain",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/840",
      impact: "Extended the int16 ternary draw fixture and independent reference to 12 word sets covering all 6 strict signed/unsigned orderings and all 4 tie patterns plus a chained low16 v_sub_nc_u16 -> v_med3_u16 -> v_med3_i16 -> v_min3_i16 fixture, draw mutations, and v_med3_u16 refusal checks."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 838,
      title: "shader: lower gfx1013 v_cvt_flr_i32_f32 and v_cvt_rpi_i32_f32 in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/838",
      impact: "Decoded VOP1 opcodes 0x0c/0x0d (and VOP3 0x18c/0x18d) in tools/disasm_rdna2.py and lowered 4 floor/round-up float-to-int forms in tools/pixel_aot.py with SSA-keyed range provenance checks restricting lowering to finite inputs proven in [-2^31, 2^31) after optional bitwise abs/neg modifiers."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 540,
      title: "shader: lower gfx1013 v_cvt_u32_f32_e64 and v_cvt_i32_f32_e64 in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/540",
      impact: "Lowered gfx1013 VOP3 truncating float-to-integer conversions with bitwise IEEE-754 abs/neg source modifiers into shared src/ffx_float_to_int.hlsli helpers, verified bit-for-bit across all 18 edge words on RTX 5070, RTX 3060 Ti, WARP, and LLVM 15/23 controls."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 542,
      title: "shader: lower gfx1013 24-bit integer multiplies in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/542",
      impact: "Lowered all 8 gfx1013 24-bit vector multiply forms (v_mul_{i32_i24,u32_u24,hi_i32_i24,hi_u32_u24} _e32/_e64) in pure 32-bit SM 6.0 HLSL without 64-bit integer shader ops, verified across 1,000,529 fuzz pairs, LLVM binary controls, and D3D12 WARP CI."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25581,
      title: "perf(tools): fast-scan C++ tokens and reaching definitions in progress",
      url: "https://github.com/boykopovar/AnyPS5/pull/25581",
      impact: "Cut progress.py runtime by 2.02x end-to-end (6.148s to 3.039s, collect_libraries 2.43x) with byte-identical 2.66 MB JSON output across 237 tests and 50,000 fuzz inputs."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25580,
      title: "perf(test): fast-scan C++ sources and declarations in test_public_headers",
      url: "https://github.com/boykopovar/AnyPS5/pull/25580",
      impact: "Cut public_headers_audit runtime by 2.33x (7.000s to 3.002s, ~4.0s saved per CI run) with byte-identical 73,193-byte manifest output across 73 tests and 4x50,000 fuzz inputs."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25579,
      title: "perf(tools): fast-scan decoder and translator sources in shader_scan",
      url: "https://github.com/boykopovar/AnyPS5/pull/25579",
      impact: "Cut shader_scan.py runtime by 5.20x (0.687s to 0.132s) with byte-identical 26,117-byte JSON output across 46 tests and 50,000 fuzz inputs."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25578,
      title: "perf(tools): avoid duplicate scans and skip AST parsing in check_test_registration",
      url: "https://github.com/boykopovar/AnyPS5/pull/25578",
      impact: "Cut check_test_registration.py runtime by 4.60x (0.902s to 0.196s across 4 CI workflows per PR) with byte-identical 34,283-byte JSON output across 110 tests and 75,000 fuzz inputs."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25577,
      title: "perf(tools): fast-scan headers and cache resolved paths in package_headers",
      url: "https://github.com/boykopovar/AnyPS5/pull/25577",
      impact: "Cut package_headers.public_headers() runtime by 3.51x (0.422s to 0.120s) and manifest generation by 2.89x with byte-identical 266,365-byte output across 144 tests and 50,000 fuzz inputs."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 539,
      title: "shader: support multi-store and constant-SGPR compute kernels in compute_store_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/539",
      impact: "Extended tools/compute_store_aot.py to lower non-overlapping multi-store raw UAV compute kernels, general s_mov_b32/s_movk_i32 constant SGPRs, s_clause hints, and vmcnt(0) waits with MULTI_FIXED/MULTI_INDEXED fixtures and 7 negative controls."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 538,
      title: "scan_unsupported_shaders: track lowered scalar, VOP3P, SDWA and conversion ops",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/538",
      impact: "Aligned tools/scan_unsupported_shaders.py with pixel_aot.py lowered instructions and _sdwa suffixes, eliminating 111 unrecognized and 723 falsely unsupported instructions across 73 shader fixtures."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 521,
      title: "shader: add dxil_retarget_probe_hardware test for GPU signing and dispatch",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/521",
      impact: "Added the dxil_retarget_probe_hardware CTest (SKIP_RETURN_CODE 77) exercising re-signed dxil-ms-xb2 PSO creation and live compute dispatch on physical GPUs, verified 10/10 on RTX 3070 with negative controls."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 351,
      title: "runtime: add desktop d3d12_xs.dll shim for root-signature imports",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/351",
      impact: "Built desktop d3d12_xs.dll exporting D3D12SerializeVersionedRootSignature (clearing only observed 0x03000000 console flags) and D3D12CreateRootSignatureDeserializer, verified across 4 CTest scenarios including live WARP CreateRootSignature and CreateComputePipelineState."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 346,
      title: "shader: re-sign retargeted DXIL containers and verify compute PSO creation",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/346",
      impact: "Added dxil.dll in-place signing (root_probe --sign), root_device_probe --compute-pso, and live WARP/hardware compute dispatch checks, enabling retargeted dxil-ms-xb2 shaders to pass CreateComputePipelineState and execute with 0 readback mismatches."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 310,
      title: "shader: lower gfx1013 v_frexp_mant_f32 and v_ldexp_f32 in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/310",
      impact: "Lowered gfx1013 v_frexp_mant_f32 (_e32/_e64) and v_ldexp_f32 in tools/pixel_aot.py via bit-exact IEEE-754 HLSL helpers verified against 609 C++ edge cases and D3D12 hardware + WARP readback."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 308,
      title: "shader: lower gfx1013 32-bit integer min, max and med3 in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/308",
      impact: "Lowered all 14 gfx1013 32-bit integer v_{min,max,min3,max3,med3}_{i32,u32} forms in tools/pixel_aot.py with LLVM binary controls and D3D12 hardware + WARP readback."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 306,
      title: "shader: lower gfx1013 32-bit integer comparisons in pixel_aot",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/306",
      impact: "Lowered all 32 gfx1013 v_cmp_*_{i32,u32} (_e32/_e64) integer comparison forms in tools/pixel_aot.py with LLVM binary controls and D3D12 hardware + WARP readback."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25157,
      title: "perf(tools): speed up file scanning and entry labeling in debt_report",
      url: "https://github.com/boykopovar/AnyPS5/pull/25157",
      impact: "Cut debt_report runtime by 2.66x on Linux and 2.27x on Windows 11 NTFS (5.889s to 2.592s) with byte-identical text and JSON output across 19 tests."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 227,
      title: "Ignore MASM macros/prefixes and inspect JUnit children in form_coverage",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/227",
      impact: "Filtered MASM LOCAL directives and macro definitions, stripped x64 prefixes in masm_mnemonics(), and checked JUnit failure/error/skipped children in tools/form_coverage.py."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 235,
      title: "Advance scene_records cursor by consumed deflate bytes only",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/235",
      impact: "Updated scene_records() in tools/resource_inventory.py to advance the scan cursor by consumed raw-DEFLATE bytes rather than the declared span, preventing oversized spans from skipping following shader records, with synthetic regression tests."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 231,
      title: "Fix VOPC classification and inline comments in scan_unsupported_shaders",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/231",
      impact: "Fixed RDNA 2 v_cmp* opcode classification into VOPC, stripped inline // comments across opcode parsing, and excluded blank/comment-only lines from shader instruction totals with regression tests."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 192,
      title: "Validate shader records and output stems in extract_shaders",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/192",
      impact: "Deferred cursor advancement to validated raw-DEFLATE bytes, enforced XBCH table and size bounds, guarded empty archives, and added case-insensitive output stem disambiguation with 5 synthetic regression tests."
    },
    {
      repo: "R0Y00/Xbox2Windows",
      prNumber: 131,
      title: "Validate DXContainers and mapped PE section bounds in call_evidence",
      url: "https://github.com/R0Y00/Xbox2Windows/pull/131",
      impact: "Unified DXContainer validation in tools/call_evidence.py via resource_inventory.parts() and added mapped PE section bounds checks with synthetic PE32+ regression tests."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25164,
      title: "perf(tools): update spans incrementally while folding debt fragments",
      url: "https://github.com/boykopovar/AnyPS5/pull/25164",
      impact: "Cut debt_fold runtime from 2.873s to 0.508s (5.66x speedup) folding 1,138 fragments across 163 debt files with byte-identical output and 0 fuzz mismatches."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 25162,
      title: "perf(tools): skip unneeded env scans and fast-scan C++ tokens in check_conventions",
      url: "https://github.com/boykopovar/AnyPS5/pull/25162",
      impact: "Cut check_conventions runtime by 7.67x on HEAD~1 (0.620s to 0.081s) and 2.71x on HEAD~20 with 278 passing tests and 0/50,000 fuzz mismatches."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 24986,
      title: "perf(tools): reuse access patterns and fast-scan guest_pointer_audit",
      url: "https://github.com/boykopovar/AnyPS5/pull/24986",
      impact: "Cut guest_pointer_audit runtime from 3.79s to 0.54s (7.0x speedup) across 1,801 C++ files with SHA-256 byte-identical text and JSON output."
    },
    {
      repo: "boykopovar/AnyPS5",
      prNumber: 24623,
      title: "perf(tools): index sources once and scan lazily in env_reference",
      url: "https://github.com/boykopovar/AnyPS5/pull/24623",
      impact: "Cut env_reference --check runtime from 50.56s to 3.92s (~13x speedup) across 7,766 source files with byte-identical SHA-256 output."
    }
  ]
};
