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
