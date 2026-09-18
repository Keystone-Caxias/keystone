/* @ds-bundle: {"format":4,"namespace":"OrdensInglesasDesignSystem_d5c0a9","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"RowActions","sourcePath":"components/data/DataTable.jsx"},{"name":"SortMark","sourcePath":"components/data/DataTable.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"922711552929","components/core/Button.jsx":"41afe5b1a948","components/core/Card.jsx":"b346a013a4ec","components/core/Icon.jsx":"1d2e27af235e","components/core/IconButton.jsx":"2ebd7a45bd66","components/core/Tag.jsx":"07730ddb6ded","components/data/DataTable.jsx":"f8271c618a10","components/feedback/Dialog.jsx":"7c4f93e5dade","components/feedback/Toast.jsx":"d268745fe68a","components/feedback/Tooltip.jsx":"7c908706afd0","components/forms/Checkbox.jsx":"ef5162c63bc0","components/forms/Input.jsx":"1d1b6e931d9d","components/forms/Radio.jsx":"37622a6ce6ad","components/forms/Select.jsx":"543b192e057f","components/forms/Switch.jsx":"b8a224196a98","components/navigation/Tabs.jsx":"beab2107adb9","ui_kits/plataforma-mobile/MobileApp.jsx":"130c20b64319","ui_kits/plataforma/Admissoes.jsx":"3e523a4ce2d4","ui_kits/plataforma/App.jsx":"e4001b4068cc","ui_kits/plataforma/Cadastro.jsx":"f1f9eb5676d8","ui_kits/plataforma/Login.jsx":"6edc682be27c","ui_kits/plataforma/Painel.jsx":"d03abd7d2dfb","ui_kits/plataforma/Shell.jsx":"340ad21f2ff2","ui_kits/plataforma/Tesouraria.jsx":"cca0234a27c9","ui_kits/plataforma/dados.jsx":"fc0ab3d00e59"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OrdensInglesasDesignSystem_d5c0a9 = window.OrdensInglesasDesignSystem_d5c0a9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Bordered paper surface. */
function Card({
  children,
  title,
  eyebrow,
  actions,
  padding = 'var(--space-5)',
  accent,
  style,
  ...rest
}) {
  const accents = {
    'arco-real': 'var(--order-arco-real)',
    marca: 'var(--order-marca)',
    nautas: 'var(--order-nautas)'
  };
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--shadow-1)',
      borderTop: accent ? `2px solid ${accents[accent] || accent}` : undefined,
      overflow: 'hidden',
      ...style
    }
  }, rest), (title || eyebrow || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: `var(--space-4) ${padding} var(--space-3)`,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 'var(--fs-lg)'
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Conjunto Lucide (substituído — ver readme ICONOGRAPHY), com os caminhos embutidos
 * para que o ícone pinte de forma síncrona, sem depender de rede.
 */
const PATHS = {
  'check': '<path d="M20 6 9 17l-5-5" />',
  'plus': '<path d="M5 12h14" /> <path d="M12 5v14" />',
  'x': '<path d="M18 6 6 18" /> <path d="m6 6 12 12" />',
  'arrow-right': '<path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />',
  'chevron-down': '<path d="m6 9 6 6 6-6" />',
  'chevron-up': '<path d="m18 15-6-6-6 6" />',
  'chevron-left': '<path d="m15 18-6-6 6-6" />',
  'chevron-right': '<path d="m9 18 6-6-6-6" />',
  'search': '<path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" />',
  'pencil': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /> <path d="m15 5 4 4" />',
  'printer': '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /> <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /> <rect x="6" y="14" width="12" height="8" rx="1" />',
  'trash-2': '<path d="M10 11v6" /> <path d="M14 11v6" /> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /> <path d="M3 6h18" /> <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
  'download': '<path d="M12 15V3" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /> <path d="m7 10 5 5 5-5" />',
  'upload': '<path d="M12 3v12" /> <path d="m17 8-5-5-5 5" /> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />',
  'funnel': '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />',
  'user-round': '<circle cx="12" cy="8" r="5" /> <path d="M20 21a8 8 0 0 0-16 0" />',
  'users-round': '<path d="M18 21a8 8 0 0 0-16 0" /> <circle cx="10" cy="8" r="5" /> <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />',
  'id-card': '<path d="M16 10h2" /> <path d="M16 14h2" /> <path d="M6.17 15a3 3 0 0 1 5.66 0" /> <circle cx="9" cy="11" r="2" /> <rect x="2" y="5" width="20" height="14" rx="2" />',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" />',
  'mail': '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /> <rect x="2" y="4" width="20" height="16" rx="2" />',
  'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0" /> <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />',
  'settings': '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" />',
  'log-out': '<path d="m16 17 5-5-5-5" /> <path d="M21 12H9" /> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />',
  'circle-help': '<circle cx="12" cy="12" r="10" /> <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /> <path d="M12 17h.01" />',
  'history': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /> <path d="M3 3v5h5" /> <path d="M12 7v5l4 2" />',
  'paperclip': '<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />',
  'receipt-text': '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /> <path d="M14 8H8" /> <path d="M16 12H8" /> <path d="M13 16H8" />',
  'scroll-text': '<path d="M15 12h-5" /> <path d="M15 8h-5" /> <path d="M19 17V5a2 2 0 0 0-2-2H4" /> <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />',
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1" /> <rect width="7" height="5" x="14" y="3" rx="1" /> <rect width="7" height="9" x="14" y="12" rx="1" /> <rect width="7" height="5" x="3" y="16" rx="1" />',
  'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /> <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /> <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /> <path d="M10 6h4" /> <path d="M10 10h4" /> <path d="M10 14h4" /> <path d="M10 18h4" />',
  'chart-no-axes-column': '<path d="M5 21v-6" /> <path d="M12 21V3" /> <path d="M19 21V9" />',
  'award': '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /> <circle cx="12" cy="8" r="6" />',
  'square-dashed': '<path d="M5 3a2 2 0 0 0-2 2" /> <path d="M19 3a2 2 0 0 1 2 2" /> <path d="M21 19a2 2 0 0 1-2 2" /> <path d="M5 21a2 2 0 0 1-2-2" /> <path d="M9 3h1" /> <path d="M9 21h1" /> <path d="M14 3h1" /> <path d="M14 21h1" /> <path d="M3 9v1" /> <path d="M21 9v1" /> <path d="M3 14v1" /> <path d="M21 14v1" />',
  'circle-check': '<circle cx="12" cy="12" r="10" /> <path d="m9 12 2 2 4-4" />',
  'circle-alert': '<circle cx="12" cy="12" r="10" /> <line x1="12" x2="12" y1="8" y2="12" /> <line x1="12" x2="12.01" y1="16" y2="16" />',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /> <path d="M12 9v4" /> <path d="M12 17h.01" />',
  'info': '<circle cx="12" cy="12" r="10" /> <path d="M12 16v-4" /> <path d="M12 8h.01" />',
  'ellipsis-vertical': '<circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" /> <circle cx="12" cy="19" r="1" />'
};

/** Glyph wrapper for the Lucide outline set. */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const body = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    "aria-hidden": "true",
    "data-icon": name,
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    dangerouslySetInnerHTML: {
      __html: body || ''
    },
    style: {
      display: 'block',
      flex: '0 0 auto',
      ...style
    }
  }, rest));
}

/** Nomes disponíveis no conjunto embutido. */
const ICON_NAMES = Object.keys(PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: ['var(--status-neutral-bg)', 'var(--status-neutral-fg)'],
  success: ['var(--status-success-bg)', 'var(--status-success-fg)'],
  warning: ['var(--status-warning-bg)', 'var(--status-warning-fg)'],
  danger: ['var(--status-danger-bg)', 'var(--status-danger-fg)'],
  info: ['var(--status-info-bg)', 'var(--status-info-fg)']
};

/** Status pill. */
function Badge({
  children,
  tone = 'neutral',
  icon,
  dot,
  style,
  ...rest
}) {
  const [bg, fg] = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 22,
      padding: '0 9px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      fontSize: 'var(--fs-3xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: fg
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    height: 30,
    padding: '0 10px',
    fontSize: 'var(--fs-2xs)',
    gap: 6,
    icon: 14
  },
  md: {
    height: 36,
    padding: '0 14px',
    fontSize: 'var(--fs-sm)',
    gap: 8,
    icon: 16
  },
  lg: {
    height: 44,
    padding: '0 20px',
    fontSize: 'var(--fs-md)',
    gap: 10,
    icon: 18
  }
};
const variants = {
  primary: {
    background: 'var(--action-primary-bg)',
    color: 'var(--action-primary-fg)',
    border: '1px solid var(--action-primary-bg)',
    hover: 'var(--action-primary-bg-hover)'
  },
  accent: {
    background: 'var(--action-accent-bg)',
    color: 'var(--action-accent-fg)',
    border: '1px solid var(--action-accent-bg)',
    hover: 'var(--action-accent-bg-hover)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    border: '1px solid var(--border-loud)',
    hover: 'var(--surface-hover)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--action-ghost-fg)',
    border: '1px solid transparent',
    hover: 'var(--surface-hover)'
  },
  danger: {
    background: 'var(--surface-card)',
    color: 'var(--status-danger-fg)',
    border: '1px solid color-mix(in oklab, var(--status-danger-fg) 35%, transparent)',
    hover: 'var(--status-danger-bg)'
  }
};

/** Primary action control. */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled,
  fullWidth,
  type = 'button',
  style,
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-body)',
      fontSize: s.fontSize,
      fontWeight: 'var(--fw-medium)',
      letterSpacing: '0.01em',
      borderRadius: 'var(--radius-2)',
      border: v.border,
      background: disabled ? 'var(--action-disabled-bg)' : hover ? v.hover : v.background,
      color: disabled ? 'var(--action-disabled-fg)' : v.color,
      borderColor: disabled ? 'var(--border-default)' : undefined,
      boxShadow: variant === 'ghost' || disabled ? 'none' : active ? 'none' : 'var(--shadow-1)',
      transform: active && !disabled ? 'translateY(1px)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-base)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    box: 28,
    icon: 14
  },
  md: {
    box: 34,
    icon: 16
  },
  lg: {
    box: 40,
    icon: 20
  }
};

/** Square icon-only action; always labelled. */
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  disabled,
  style,
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const [hover, setHover] = React.useState(false);
  const solid = variant === 'solid';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.box,
      height: s.box,
      borderRadius: 'var(--radius-2)',
      border: variant === 'outline' ? '1px solid var(--border-loud)' : '1px solid transparent',
      background: disabled ? 'transparent' : solid ? hover ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)' : hover ? 'var(--surface-hover)' : 'transparent',
      color: disabled ? 'var(--action-disabled-fg)' : solid ? 'var(--action-primary-fg)' : 'var(--text-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-base)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const orders = {
  'arco-real': ['var(--order-arco-real-bg)', 'var(--order-arco-real)'],
  marca: ['var(--order-marca-bg)', 'var(--gold-700)'],
  nautas: ['var(--order-nautas-bg)', 'var(--order-nautas)']
};

/** Square label for orders, degrees and free classification. */
function Tag({
  children,
  order,
  onRemove,
  style,
  ...rest
}) {
  const [bg, fg] = orders[order] || ['var(--surface-sunken)', 'var(--text-body)'];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: onRemove ? '0 5px 0 9px' : '0 9px',
      borderRadius: 'var(--radius-1)',
      background: bg,
      color: fg,
      border: `1px solid color-mix(in oklab, ${fg} 22%, transparent)`,
      fontSize: 'var(--fs-2xs)',
      fontWeight: 'var(--fw-medium)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), order && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      background: fg,
      transform: 'rotate(45deg)'
    }
  }), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Remover",
    onClick: onRemove,
    style: {
      display: 'inline-flex',
      border: 0,
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      padding: 2,
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 11
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Registry table: hairline rows, tabular figures, uppercase head. */
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  selectedId,
  empty = 'Nenhum registro.',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      overflowX: 'auto',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '0 var(--space-4) 8px',
      fontSize: 'var(--fs-3xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      borderBottom: '1px solid var(--border-default)',
      whiteSpace: 'nowrap',
      width: c.width
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: 'var(--space-8)',
      textAlign: 'center',
      color: 'var(--text-faint)'
    }
  }, empty)), rows.map((row, i) => {
    const id = row.id ?? i;
    const isSel = selectedId != null && selectedId === id;
    return /*#__PURE__*/React.createElement("tr", {
      key: id,
      onMouseEnter: () => setHover(id),
      onMouseLeave: () => setHover(null),
      onClick: () => onRowClick && onRowClick(row),
      style: {
        background: isSel ? 'var(--surface-selected)' : hover === id ? 'var(--surface-hover)' : 'transparent',
        cursor: onRowClick ? 'pointer' : 'default',
        transition: `background var(--duration-instant) linear`
      }
    }, columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      className: c.numeric ? 'numeric' : undefined,
      style: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: c.align || 'left',
        borderBottom: '1px solid var(--border-subtle)',
        color: c.strong ? 'var(--text-strong)' : 'var(--text-body)',
        fontWeight: c.strong ? 'var(--fw-medium)' : 'var(--fw-regular)',
        whiteSpace: c.wrap ? 'normal' : 'nowrap'
      }
    }, c.render ? c.render(row) : row[c.key])));
  }))));
}

/** Right-aligned row affordance cluster. */
function RowActions({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2,
      justifyContent: 'flex-end'
    }
  }, children);
}

/** Inline "sorted by" marker for a column header. */
function SortMark({
  dir = 'asc'
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: dir === 'asc' ? 'chevron-up' : 'chevron-down',
    size: 12,
    style: {
      marginLeft: 4,
      verticalAlign: 'middle'
    }
  });
}
Object.assign(__ds_scope, { DataTable, RowActions, SortMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** Centered modal over a scrim. */
function Dialog({
  open = true,
  title,
  eyebrow,
  description,
  children,
  footer,
  onClose,
  width = 480
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-6)',
      background: 'rgba(20,19,17,.42)',
      backdropFilter: 'blur(2px)',
      animation: 'none'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-4)',
      boxShadow: 'var(--shadow-3)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-4)',
      padding: 'var(--space-5) var(--space-5) var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-xl)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Fechar",
    size: "sm",
    onClick: onClose
  })), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-5) var(--space-5)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  success: ['var(--status-success-fg)', 'circle-check'],
  danger: ['var(--status-danger-fg)', 'circle-alert'],
  warning: ['var(--status-warning-fg)', 'triangle-alert'],
  info: ['var(--status-info-fg)', 'info']
};

/** Transient confirmation notice. */
function Toast({
  tone = 'success',
  title,
  description,
  onClose,
  style,
  ...rest
}) {
  const [fg, icon] = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      width: 340,
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderLeft: `3px solid ${fg}`,
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--shadow-2)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    color: fg,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 2,
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, title), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dispensar",
    size: "sm",
    onClick: onClose
  }));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Hover label for icon-only affordances. */
function Tooltip({
  label,
  children,
  placement = 'top',
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -6px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%, 6px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-6px, -50%)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(6px, -50%)'
    }
  }[placement];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 40,
      padding: '4px 8px',
      background: 'var(--surface-navy-deep)',
      color: 'var(--text-inverse)',
      fontSize: 'var(--fs-3xs)',
      letterSpacing: '0.01em',
      borderRadius: 'var(--radius-1)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: show ? 1 : 0,
      transition: `opacity var(--duration-fast) var(--ease-standard)`
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square checkbox with inline label. */
function Checkbox({
  label,
  hint,
  checked,
  onChange,
  disabled,
  id,
  ...rest
}) {
  const boxId = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: boxId,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: boxId,
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 17,
      height: 17,
      marginTop: 1,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-1)',
      border: `1px solid ${checked ? 'var(--action-primary-bg)' : 'var(--border-loud)'}`,
      background: checked ? 'var(--action-primary-bg)' : 'var(--surface-card)',
      color: 'var(--action-primary-fg)',
      transition: 'var(--transition-base)'
    }
  }, checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 12
  })), (label || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, hint)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text field with label, hint and error. */
function Input({
  label,
  hint,
  error,
  iconLeft,
  suffix,
  required,
  id,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6,
      ...wrapperStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--fs-2xs)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      letterSpacing: '0.02em'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--status-danger-fg)',
      marginLeft: 3
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 36,
      padding: '0 10px',
      background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-2)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'var(--transition-base)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 15,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 'none',
      background: 'transparent',
      font: 'inherit',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      ...style
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-faint)'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: invalid ? 'var(--status-danger-fg)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Single radio row. */
function Radio({
  label,
  hint,
  checked,
  name,
  value,
  onChange,
  disabled,
  id,
  ...rest
}) {
  const radioId = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: radioId,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: radioId,
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 17,
      height: 17,
      marginTop: 1,
      flex: '0 0 auto',
      borderRadius: '50%',
      border: `1px solid ${checked ? 'var(--action-primary-bg)' : 'var(--border-loud)'}`,
      background: 'var(--surface-card)',
      transition: 'var(--transition-base)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--action-primary-bg)'
    }
  })), (label || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, hint)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select in system dress. */
function Select({
  label,
  hint,
  error,
  options = [],
  placeholder,
  required,
  id,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || React.useId();
  const invalid = Boolean(error);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6,
      ...wrapperStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: 'var(--fs-2xs)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      letterSpacing: '0.02em'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--status-danger-fg)',
      marginLeft: 3
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      width: '100%',
      height: 36,
      padding: '0 32px 0 10px',
      background: rest.disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${invalid ? 'var(--status-danger-fg)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-2)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      font: 'inherit',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      transition: 'var(--transition-base)',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 15,
    color: "var(--text-muted)",
    style: {
      position: 'absolute',
      right: 10,
      pointerEvents: 'none'
    }
  })), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: invalid ? 'var(--status-danger-fg)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Immediate on/off toggle. */
function Switch({
  label,
  hint,
  checked,
  onChange,
  disabled,
  id,
  ...rest
}) {
  const switchId = id || React.useId();
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: switchId,
    type: "checkbox",
    role: "switch",
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      width: 34,
      height: 19,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--action-primary-bg)' : 'var(--neutral-200)',
      transition: `background var(--duration-fast) var(--ease-standard)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 17 : 2,
      width: 15,
      height: 15,
      borderRadius: '50%',
      background: 'var(--neutral-0)',
      boxShadow: 'var(--shadow-1)',
      transition: `left var(--duration-fast) var(--ease-standard)`
    }
  })), (label || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, label), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, hint)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Underlined tab strip. */
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  const active = value ?? (items[0] && (items[0].value ?? items[0]));
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, rest), items.map(raw => {
    const item = typeof raw === 'string' ? {
      value: raw,
      label: raw
    } : raw;
    const isActive = item.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.value,
      role: "tab",
      "aria-selected": isActive,
      onClick: () => onChange && onChange(item.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        padding: '0 0 10px',
        marginBottom: -1,
        borderBottom: `2px solid ${isActive ? 'var(--order-arco-real)' : 'transparent'}`,
        color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
        font: 'inherit',
        fontSize: 'var(--fs-sm)',
        fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        transition: 'var(--transition-base)'
      }
    }, item.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: item.icon,
      size: 15
    }), item.label, item.count != null && /*#__PURE__*/React.createElement("span", {
      className: "numeric",
      style: {
        fontSize: 'var(--fs-3xs)',
        color: 'var(--text-faint)'
      }
    }, item.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma-mobile/MobileApp.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  IconButton,
  Input,
  Icon,
  Dialog,
  Toast,
  Tabs,
  Checkbox,
  Switch
} = window.OrdensInglesasDesignSystem_d5c0a9;
function BarraTopo({
  titulo,
  eyebrow,
  acao,
  onVoltar
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 14px',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, onVoltar ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Voltar",
    onClick: onVoltar
  }) : /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      width: 22,
      mixBlendMode: 'multiply'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'grid',
      gap: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: 10
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: 'var(--fs-lg)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, titulo)), acao);
}
function Linha({
  children,
  onClick
}) {
  const [a, setA] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onTouchStart: () => setA(true),
    onTouchEnd: () => setA(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      textAlign: 'left',
      border: 0,
      borderBottom: '1px solid var(--border-subtle)',
      background: a ? 'var(--surface-hover)' : 'var(--surface-card)',
      padding: '13px 14px',
      font: 'inherit',
      cursor: 'pointer',
      minHeight: 60
    }
  }, children);
}
function Painel({
  ir
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-navy-deep)',
      color: 'var(--text-inverse)',
      padding: '18px 16px 20px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      position: 'absolute',
      right: -30,
      top: -40,
      height: 190,
      filter: 'invert(1)',
      opacity: 0.08,
      mixBlendMode: 'screen'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--gold-300)',
      fontSize: 10
    }
  }, "Cap\xEDtulo 12 \xB7 Recife"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-2xl)',
      marginTop: 4,
      lineHeight: 1.1
    }
  }, "Exerc\xEDcio 2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--rule-ornament)',
      width: 72,
      margin: '14px 0 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, [['Arrecadado', 'R$ 148.320', 'var(--gold-300)'], ['Em atraso', 'R$ 9.640', 'var(--crimson-300)']].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'rgba(250,248,244,.6)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-xl)',
      color: c
    }
  }, v)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 14px',
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, [['Irmãos ativos', '184', 'users-round'], ['Admissões', '4', 'scroll-text']].map(([k, v, ic]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--shadow-1)',
      padding: '12px 14px',
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 16,
    color: "var(--text-faint)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xl)',
      color: 'var(--text-strong)',
      lineHeight: 1
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, k)))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Tesouraria",
    title: "\xDAltimos lan\xE7amentos",
    padding: "0",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => ir('tesouraria')
    }, "Ver")
  }, /*#__PURE__*/React.createElement("div", null, window.LANCAMENTOS.slice(0, 4).map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 16px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, l.irmao), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, l.data, " \xB7 ", l.tipo)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 3,
      justifyItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, "R$ ", l.valor), /*#__PURE__*/React.createElement(Badge, {
    tone: l.sit[0],
    dot: true
  }, l.sit[1])))))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Agenda",
    title: "Pr\xF3ximas sess\xF5es",
    accent: "arco-real"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, [['12/08', 'Sessão de exaltação', 'Capítulo 12 · Recife'], ['19/08', 'Instalação de oficiais', 'Loja da Marca 4']].map(([d, t, l]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-xs)',
      color: 'var(--text-accent)',
      width: 40
    }
  }, d), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, l))))))));
}
function Cadastro({
  onAbrir
}) {
  const [busca, setBusca] = React.useState('');
  const rows = window.IRMAOS.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase()));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Buscar irm\xE3o ou matr\xEDcula",
    iconLeft: "search",
    value: busca,
    onChange: e => setBusca(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '12px 14px',
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "Todas as Ordens"), /*#__PURE__*/React.createElement(Tag, {
    order: "arco-real"
  }, "Arco Real"), /*#__PURE__*/React.createElement(Tag, {
    order: "marca"
  }, "Marca"), /*#__PURE__*/React.createElement(Tag, {
    order: "nautas"
  }, "Nautas")), /*#__PURE__*/React.createElement("div", null, rows.map(i => /*#__PURE__*/React.createElement(Linha, {
    key: i.id,
    onClick: () => onAbrir(i)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      flex: '0 0 auto',
      background: 'var(--surface-sunken)',
      border: 'var(--border-hairline)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, i.nome.split(' ')[0][0], i.nome.split(' ').slice(-1)[0][0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'grid',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      fontWeight: 'var(--fw-medium)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, i.nome), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, i.mat), /*#__PURE__*/React.createElement(Badge, {
    tone: i.sit[0],
    dot: true
  }, i.sit[1]))), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    color: "var(--text-faint)"
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      padding: 28,
      textAlign: 'center',
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-faint)'
    }
  }, "Nenhum irm\xE3o encontrado com esses crit\xE9rios.")));
}
function Ficha({
  irmao
}) {
  const [aba, setAba] = React.useState('dados');
  const linha = (k, v) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      padding: '11px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      fontSize: 10
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      textAlign: 'right'
    }
  }, v));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 14px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    order: irmao.ordem
  }, window.ORDENS[irmao.ordem]), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-2xl)'
    }
  }, irmao.nome), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, irmao.mat, " \xB7 desde ", irmao.desde)), /*#__PURE__*/React.createElement(Tabs, {
    value: aba,
    onChange: setAba,
    items: [{
      value: 'dados',
      label: 'Dados'
    }, {
      value: 'graus',
      label: 'Graus',
      count: 3
    }, {
      value: 'fin',
      label: 'Financeiro'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, aba === 'dados' && /*#__PURE__*/React.createElement(React.Fragment, null, linha('Grau atual', irmao.grau), linha('Capítulo / Arca', irmao.capitulo), linha('E-mail', irmao.email), linha('Situação', /*#__PURE__*/React.createElement(Badge, {
    tone: irmao.sit[0],
    dot: true
  }, irmao.sit[1]))), aba === 'graus' && [['Companheiro exaltado', '14/03/2019'], ['Mestre da Marca', '08/09/2021'], ['Arco Real', '22/05/2024']].map(([g, d]) => linha(d, g)), aba === 'fin' && window.LANCAMENTOS.slice(0, 4).map(l => linha(`${l.data} · ${l.tipo}`, `R$ ${l.valor}`))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    iconLeft: "pencil"
  }, "Editar cadastro"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    variant: "secondary",
    iconLeft: "printer"
  }, "Emitir ficha")));
}
function Admissoes() {
  const [confirmar, setConfirmar] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [aprovados, setAprovados] = React.useState([]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 14px 4px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, "Etapas: ", window.ETAPAS.map((e, i) => `${i + 1}. ${e}`).join(' · '))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px 24px',
      display: 'grid',
      gap: 12
    }
  }, window.ADMISSOES.map(a => {
    const ok = aprovados.includes(a.id) || a.sit[1] === 'Aprovado';
    return /*#__PURE__*/React.createElement(Card, {
      key: a.id,
      accent: a.ordem,
      padding: "14px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-md)',
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-medium)'
      }
    }, a.nome), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-2xs)',
        color: 'var(--text-muted)'
      }
    }, a.origem)), ok ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Aprovado") : /*#__PURE__*/React.createElement(Badge, {
      tone: a.sit[0],
      dot: true
    }, a.sit[1])), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, window.ETAPAS.map((e, i) => /*#__PURE__*/React.createElement("span", {
      key: e,
      style: {
        flex: 1,
        height: 4,
        borderRadius: 'var(--radius-pill)',
        background: i < (ok ? 4 : a.etapa) ? 'var(--verde-500)' : i === a.etapa && !ok ? 'var(--gold-500)' : 'var(--neutral-100)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "numeric",
      style: {
        fontSize: 'var(--fs-2xs)',
        color: 'var(--text-faint)'
      }
    }, "Entrada ", a.entrada), !ok && /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => setConfirmar(a)
    }, "Aprovar"))));
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(confirmar),
    width: 330,
    eyebrow: confirmar ? window.ORDENS[confirmar.ordem] : '',
    title: "Aprovar admiss\xE3o?",
    description: confirmar ? `${confirmar.nome} será exaltado na próxima sessão.` : '',
    onClose: () => setConfirmar(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => setConfirmar(null)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "accent",
      iconLeft: "check",
      onClick: () => {
        setAprovados(p => [...p, confirmar.id]);
        setToast(confirmar.nome);
        setConfirmar(null);
      }
    }, "Aprovar"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Documenta\xE7\xE3o conferida",
    checked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Taxa de admiss\xE3o quitada",
    checked: true
  }))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 76
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success",
    title: "Admiss\xE3o aprovada",
    description: `${toast} consta como aprovado.`,
    onClose: () => setToast(null),
    style: {
      width: '100%'
    }
  })));
}
function Tesouraria() {
  const [aba, setAba] = React.useState('todos');
  const [auto, setAuto] = React.useState(true);
  const rows = window.LANCAMENTOS.filter(l => aba === 'todos' || (aba === 'abertos' ? l.sit[1] !== 'Quite' : l.sit[1] === 'Quite'));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 14px 0',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: aba,
    onChange: setAba,
    items: [{
      value: 'todos',
      label: 'Todos'
    }, {
      value: 'abertos',
      label: 'Em aberto'
    }, {
      value: 'quitados',
      label: 'Quitados'
    }]
  })), /*#__PURE__*/React.createElement("div", null, rows.map(l => /*#__PURE__*/React.createElement(Linha, {
    key: l.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'grid',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)',
      fontWeight: 'var(--fw-medium)'
    }
  }, l.tipo), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, l.doc, " \xB7 ", l.irmao)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 3,
      justifyItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, "R$ ", l.valor), /*#__PURE__*/React.createElement(Badge, {
    tone: l.sit[0],
    dot: true
  }, l.sit[1]))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 14px 24px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Cobran\xE7a",
    title: "Anuidade 2026",
    accent: "marca"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, [['Arco Real', '1.240,00'], ['Marca', '620,00'], ['Nautas', '380,00']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "numeric"
  }, "R$ ", v))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Cobran\xE7a autom\xE1tica",
    hint: "Aviso 10 dias antes",
    checked: auto,
    onChange: e => setAuto(e.target.checked)
  })))));
}
const ABAS = [{
  key: 'painel',
  label: 'Painel',
  icon: 'layout-dashboard'
}, {
  key: 'cadastro',
  label: 'Cadastro',
  icon: 'users-round'
}, {
  key: 'admissoes',
  label: 'Admissões',
  icon: 'scroll-text'
}, {
  key: 'tesouraria',
  label: 'Tesouraria',
  icon: 'receipt-text'
}];
function MobileApp() {
  const [aba, setAba] = React.useState('painel');
  const [irmao, setIrmao] = React.useState(null);
  const titulos = {
    painel: 'Painel',
    cadastro: 'Cadastro de irmãos',
    admissoes: 'Admissões',
    tesouraria: 'Tesouraria'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
      background: 'var(--surface-page)'
    }
  }, irmao ? /*#__PURE__*/React.createElement(BarraTopo, {
    titulo: "Ficha do irm\xE3o",
    eyebrow: window.ORDENS[irmao.ordem],
    onVoltar: () => setIrmao(null),
    acao: /*#__PURE__*/React.createElement(IconButton, {
      icon: "ellipsis-vertical",
      label: "Mais a\xE7\xF5es"
    })
  }) : /*#__PURE__*/React.createElement(BarraTopo, {
    titulo: titulos[aba],
    eyebrow: "Cap\xEDtulo 12 \xB7 Recife",
    acao: aba === 'painel' ? /*#__PURE__*/React.createElement(IconButton, {
      icon: "bell",
      label: "Notifica\xE7\xF5es"
    }) : /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "Novo registro",
      variant: "outline"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      position: 'relative'
    }
  }, irmao ? /*#__PURE__*/React.createElement(Ficha, {
    irmao: irmao
  }) : aba === 'painel' ? /*#__PURE__*/React.createElement(Painel, {
    ir: setAba
  }) : aba === 'cadastro' ? /*#__PURE__*/React.createElement(Cadastro, {
    onAbrir: setIrmao
  }) : aba === 'admissoes' ? /*#__PURE__*/React.createElement(Admissoes, null) : /*#__PURE__*/React.createElement(Tesouraria, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      background: 'var(--surface-navy)',
      paddingBottom: 6
    }
  }, ABAS.map(t => {
    const on = !irmao && aba === t.key;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      onClick: () => {
        setIrmao(null);
        setAba(t.key);
      },
      style: {
        display: 'grid',
        gap: 4,
        justifyItems: 'center',
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        padding: '10px 4px',
        minHeight: 56,
        borderTop: `2px solid ${on ? 'var(--gold-400)' : 'transparent'}`,
        color: on ? 'var(--neutral-0)' : 'rgba(250,248,244,.6)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 19
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        letterSpacing: '.02em'
      }
    }, t.label));
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(MobileApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma-mobile/MobileApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Admissoes.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  IconButton,
  Dialog,
  Toast,
  DataTable,
  RowActions,
  Tabs,
  Icon,
  Checkbox
} = window.OrdensInglesasDesignSystem_d5c0a9;
function Passos({
  etapa
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, window.ETAPAS.map((e, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: e
  }, /*#__PURE__*/React.createElement("span", {
    title: e,
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      display: 'grid',
      placeItems: 'center',
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      background: i < etapa ? 'var(--verde-500)' : i === etapa ? 'var(--gold-500)' : 'var(--neutral-100)',
      color: i <= etapa ? 'var(--neutral-0)' : 'var(--text-faint)'
    }
  }, i + 1), i < window.ETAPAS.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 1,
      background: 'var(--border-default)'
    }
  }))));
}
function Admissoes() {
  const [aba, setAba] = React.useState('curso');
  const [confirmar, setConfirmar] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [aprovados, setAprovados] = React.useState([]);
  const rows = window.ADMISSOES.filter(a => aba === 'curso' ? !aprovados.includes(a.id) && a.sit[1] !== 'Aprovado' : aprovados.includes(a.id) || a.sit[1] === 'Aprovado');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, {
    eyebrow: "Fluxo de admiss\xE3o",
    title: "Admiss\xF5es",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus"
    }, "Nova proposta")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-6)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-5) 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: aba,
    onChange: setAba,
    items: [{
      value: 'curso',
      label: 'Em curso',
      count: window.ADMISSOES.length - 1 - aprovados.length
    }, {
      value: 'concluidas',
      label: 'Concluídas',
      count: 1 + aprovados.length
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    empty: "Nenhuma proposta nesta situa\xE7\xE3o.",
    columns: [{
      key: 'nome',
      label: 'Candidato',
      strong: true
    }, {
      key: 'ordem',
      label: 'Ordem pretendida',
      render: r => /*#__PURE__*/React.createElement(Tag, {
        order: r.ordem
      }, window.ORDENS[r.ordem])
    }, {
      key: 'origem',
      label: 'Loja de origem'
    }, {
      key: 'entrada',
      label: 'Entrada',
      numeric: true
    }, {
      key: 'etapa',
      label: 'Etapas',
      render: r => /*#__PURE__*/React.createElement(Passos, {
        etapa: aprovados.includes(r.id) ? 4 : r.etapa
      })
    }, {
      key: 'sit',
      label: 'Situação',
      render: r => aprovados.includes(r.id) ? /*#__PURE__*/React.createElement(Badge, {
        tone: "success",
        dot: true
      }, "Aprovado") : /*#__PURE__*/React.createElement(Badge, {
        tone: r.sit[0],
        dot: true
      }, r.sit[1])
    }, {
      key: 'acoes',
      label: '',
      align: 'right',
      render: r => /*#__PURE__*/React.createElement(RowActions, null, !aprovados.includes(r.id) && r.sit[1] !== 'Aprovado' && /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "secondary",
        onClick: () => setConfirmar(r)
      }, "Aprovar"), /*#__PURE__*/React.createElement(IconButton, {
        icon: "paperclip",
        label: "Documentos",
        size: "sm"
      }))
    }]
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-faint)',
      marginTop: 'var(--space-3)'
    }
  }, "Etapas: ", window.ETAPAS.map((e, i) => `${i + 1}. ${e}`).join(' · ')), /*#__PURE__*/React.createElement(Dialog, {
    open: Boolean(confirmar),
    eyebrow: confirmar ? window.ORDENS[confirmar.ordem] : '',
    title: "Aprovar admiss\xE3o?",
    width: 460,
    description: confirmar ? `${confirmar.nome} será exaltado na próxima sessão do Capítulo.` : '',
    onClose: () => setConfirmar(null),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => setConfirmar(null)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "accent",
      iconLeft: "check",
      onClick: () => {
        setAprovados(a => [...a, confirmar.id]);
        setToast(confirmar.nome);
        setConfirmar(null);
      }
    }, "Aprovar admiss\xE3o"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Documenta\xE7\xE3o conferida pelo Escriba",
    checked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Taxa de admiss\xE3o quitada",
    checked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Comunicar o candidato por e-mail"
  }))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 'var(--space-6)',
      bottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    tone: "success",
    title: "Admiss\xE3o aprovada",
    description: `${toast} consta como aprovado no exercício 2026.`,
    onClose: () => setToast(null)
  }))));
}
Object.assign(window, {
  Admissoes,
  Passos
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Admissoes.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/App.jsx
try { (() => {
function App() {
  const [logado, setLogado] = React.useState(false);
  const [screen, setScreen] = React.useState('painel');
  if (!logado) return /*#__PURE__*/React.createElement(Login, {
    onEnter: () => setLogado(true)
  });
  const telas = {
    painel: /*#__PURE__*/React.createElement(Painel, {
      onNavigate: setScreen
    }),
    cadastro: /*#__PURE__*/React.createElement(Cadastro, null),
    admissoes: /*#__PURE__*/React.createElement(Admissoes, null),
    tesouraria: /*#__PURE__*/React.createElement(Tesouraria, null)
  };
  return /*#__PURE__*/React.createElement(Shell, {
    screen: screen,
    onNavigate: setScreen
  }, telas[screen] || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, {
    eyebrow: "Em defini\xE7\xE3o",
    title: {
      capitulos: 'Capítulos e Arcas',
      relatorios: 'Relatórios',
      ajustes: 'Ajustes'
    }[screen]
  }), /*#__PURE__*/React.createElement(Placeholder, {
    label: "Sem especifica\xE7\xE3o recebida"
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Cadastro.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  IconButton,
  Input,
  Select,
  DataTable,
  RowActions,
  Tabs,
  Icon,
  Tooltip
} = window.OrdensInglesasDesignSystem_d5c0a9;
function Detalhe({
  irmao,
  onClose
}) {
  const [aba, setAba] = React.useState('dados');
  const linha = (k, v) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, v));
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 380,
      flex: '0 0 auto',
      background: 'var(--surface-card)',
      borderLeft: '1px solid var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5) var(--space-5) var(--space-4)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    order: irmao.ordem
  }, window.ORDENS[irmao.ordem]), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-xl)'
    }
  }, irmao.nome), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, irmao.mat, " \xB7 desde ", irmao.desde)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Fechar",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-5)',
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: aba,
    onChange: setAba,
    items: [{
      value: 'dados',
      label: 'Dados'
    }, {
      value: 'graus',
      label: 'Graus',
      count: 3
    }, {
      value: 'fin',
      label: 'Financeiro',
      count: 12
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-5)',
      display: 'grid',
      gap: 'var(--space-4)',
      alignContent: 'start'
    }
  }, aba === 'dados' && /*#__PURE__*/React.createElement(React.Fragment, null, linha('Grau atual', irmao.grau), linha('Capítulo / Arca', irmao.capitulo), linha('E-mail', irmao.email), linha('Situação financeira', /*#__PURE__*/React.createElement(Badge, {
    tone: irmao.sit[0],
    dot: true
  }, irmao.sit[1])), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    iconLeft: "pencil"
  }, "Editar cadastro"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconLeft: "printer"
  }, "Ficha"))), aba === 'graus' && [['Companheiro exaltado', '14/03/2019'], ['Mestre da Marca', '08/09/2021'], ['Arco Real', '22/05/2024']].map(([g, d]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, g), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, d))), aba === 'fin' && window.LANCAMENTOS.slice(0, 4).map(l => /*#__PURE__*/React.createElement("div", {
    key: l.id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, l.tipo), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, l.data, " \xB7 ", l.doc)), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }, "R$ ", l.valor)))));
}
function Cadastro() {
  const [sel, setSel] = React.useState(null);
  const [busca, setBusca] = React.useState('');
  const [ordem, setOrdem] = React.useState('');
  const rows = window.IRMAOS.filter(i => (!ordem || i.ordem === ordem) && i.nome.toLowerCase().includes(busca.toLowerCase()));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, {
    eyebrow: "Registro",
    title: "Cadastro de irm\xE3os",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "upload"
    }, "Importar"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus"
    }, "Novo cadastro"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'auto',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-end',
      padding: 'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Buscar por nome ou matr\xEDcula",
    iconLeft: "search",
    value: busca,
    onChange: e => setBusca(e.target.value),
    wrapperStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Select, {
    placeholder: "Todas as Ordens",
    value: ordem,
    onChange: e => setOrdem(e.target.value),
    options: Object.entries(window.ORDENS).map(([v, l]) => ({
      value: v,
      label: l
    })),
    wrapperStyle: {
      width: 200
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: "funnel"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    selectedId: sel && sel.id,
    onRowClick: setSel,
    empty: "Nenhum irm\xE3o encontrado com esses crit\xE9rios.",
    columns: [{
      key: 'nome',
      label: 'Irmão',
      strong: true
    }, {
      key: 'mat',
      label: 'Matrícula',
      numeric: true
    }, {
      key: 'ordem',
      label: 'Ordem',
      render: r => /*#__PURE__*/React.createElement(Tag, {
        order: r.ordem
      }, window.ORDENS[r.ordem])
    }, {
      key: 'capitulo',
      label: 'Capítulo / Arca'
    }, {
      key: 'sit',
      label: 'Situação',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.sit[0],
        dot: true
      }, r.sit[1])
    }, {
      key: 'acoes',
      label: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(RowActions, null, /*#__PURE__*/React.createElement(Tooltip, {
        label: "Editar"
      }, /*#__PURE__*/React.createElement(IconButton, {
        icon: "pencil",
        label: "Editar",
        size: "sm"
      })), /*#__PURE__*/React.createElement(Tooltip, {
        label: "Ficha"
      }, /*#__PURE__*/React.createElement(IconButton, {
        icon: "printer",
        label: "Ficha",
        size: "sm"
      })))
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-3) var(--space-5)',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, rows.length, " de 184 registros"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    label: "Anterior",
    size: "sm",
    variant: "outline"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-right",
    label: "Pr\xF3xima",
    size: "sm",
    variant: "outline"
  }))))), sel && /*#__PURE__*/React.createElement(Detalhe, {
    irmao: sel,
    onClose: () => setSel(null)
  })));
}
Object.assign(window, {
  Cadastro,
  Detalhe
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Cadastro.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Login.jsx
try { (() => {
const {
  Button,
  Input,
  Checkbox
} = window.OrdensInglesasDesignSystem_d5c0a9;
function Login({
  onEnter
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-navy-deep)',
      color: 'var(--text-inverse)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      position: 'absolute',
      right: -90,
      top: '50%',
      transform: 'translateY(-50%)',
      height: '105%',
      filter: 'invert(1)',
      opacity: 0.08,
      mixBlendMode: 'screen'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      width: 30,
      filter: 'invert(1)',
      mixBlendMode: 'screen'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-lg)'
    }
  }, "Ordens Inglesas")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--gold-300)'
    }
  }, "Plataforma interna"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-4xl)',
      color: 'var(--neutral-0)',
      marginTop: 8,
      lineHeight: 1.08
    }
  }, "Cadastro, admiss\xE3o e finan\xE7as das tr\xEAs Ordens"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'var(--rule-ornament)',
      width: 96,
      margin: '20px 0'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-md)',
      color: 'rgba(250,248,244,.72)'
    }
  }, "Arco Real \xB7 Mestre Ma\xE7om da Marca \xB7 Nautas da Arca Real")), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'relative',
      fontSize: 'var(--fs-2xs)',
      color: 'rgba(250,248,244,.45)'
    }
  }, "Acesso restrito aos oficiais em exerc\xEDcio. Todo acesso \xE9 registrado.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onEnter();
    },
    style: {
      width: 340,
      display: 'grid',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-2xl)'
    }
  }, "Entrar"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, "Use a matr\xEDcula do seu Cap\xEDtulo ou Arca.")), /*#__PURE__*/React.createElement(Input, {
    label: "Matr\xEDcula",
    defaultValue: "AR-2024-0117",
    iconLeft: "id-card",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Senha",
    type: "password",
    defaultValue: "senha-secreta",
    iconLeft: "lock",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Manter sess\xE3o"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 'var(--fs-2xs)'
    }
  }, "Esqueci a senha")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    fullWidth: true,
    iconRight: "arrow-right"
  }, "Entrar na plataforma"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-faint)',
      textAlign: 'center'
    }
  }, "D\xFAvidas de acesso: fale com o Escriba do seu Cap\xEDtulo."))));
}
window.Login = Login;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Painel.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  DataTable,
  Icon
} = window.OrdensInglesasDesignSystem_d5c0a9;
function Metric({
  eyebrow,
  value,
  unit,
  hint,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--shadow-1)',
      padding: 'var(--space-4) var(--space-5)',
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6
    }
  }, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-muted)'
    }
  }, unit), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-3xl)',
      color: 'var(--text-strong)',
      lineHeight: 1
    }
  }, value)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: tone ? `var(--status-${tone}-fg)` : 'var(--text-muted)'
    }
  }, hint));
}
function Painel({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, {
    eyebrow: "Cap\xEDtulo 12 \xB7 Recife",
    title: "Painel do exerc\xEDcio 2026",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "download"
    }, "Exportar"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus",
      onClick: () => onNavigate('cadastro')
    }, "Novo cadastro"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-6)',
      display: 'grid',
      gap: 'var(--space-6)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Irm\xE3os ativos",
    value: "184",
    hint: "+6 no exerc\xEDcio",
    tone: "success"
  }), /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Admiss\xF5es em curso",
    value: "4",
    hint: "2 aguardando parecer",
    tone: "warning"
  }), /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Arrecadado",
    unit: "R$",
    value: "148.320",
    hint: "82% da previs\xE3o"
  }), /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Em atraso",
    unit: "R$",
    value: "9.640",
    hint: "11 irm\xE3os vencidos",
    tone: "danger"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Tesouraria",
    title: "\xDAltimos lan\xE7amentos",
    padding: "0",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: "arrow-right",
      onClick: () => onNavigate('tesouraria')
    }, "Ver tudo")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0 var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: window.LANCAMENTOS.slice(0, 5),
    columns: [{
      key: 'data',
      label: 'Data',
      numeric: true
    }, {
      key: 'irmao',
      label: 'Irmão',
      strong: true
    }, {
      key: 'tipo',
      label: 'Tipo'
    }, {
      key: 'sit',
      label: 'Situação',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.sit[0],
        dot: true
      }, r.sit[1])
    }, {
      key: 'valor',
      label: 'Valor (BRL)',
      numeric: true,
      align: 'right'
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Composi\xE7\xE3o",
    title: "Irm\xE3os por Ordem"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, [['arco-real', 'Arco Real', 96, 'var(--order-arco-real)'], ['marca', 'Mestre da Marca', 58, 'var(--order-marca)'], ['nautas', 'Nautas da Arca Real', 30, 'var(--order-nautas)']].map(([k, label, n, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    className: "numeric"
  }, n)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${n / 96 * 100}%`,
      height: '100%',
      background: c,
      borderRadius: 'var(--radius-pill)'
    }
  })))))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Agenda",
    title: "Pr\xF3ximas sess\xF5es",
    accent: "arco-real"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, [['12/08', 'Sessão de exaltação', 'Capítulo 12 · Recife'], ['19/08', 'Instalação de oficiais', 'Loja da Marca 4'], ['02/09', 'Assembleia da Arca', 'Arca 2 · Jaboatão']].map(([d, t, l]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-xs)',
      color: 'var(--text-accent)',
      width: 42
    }
  }, d), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, l))))))))));
}
Object.assign(window, {
  Painel,
  Metric
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Painel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Shell.jsx
try { (() => {
const {
  Icon,
  IconButton,
  Tooltip,
  Badge
} = window.OrdensInglesasDesignSystem_d5c0a9;
const NAV = [{
  key: 'painel',
  label: 'Painel',
  icon: 'layout-dashboard'
}, {
  key: 'cadastro',
  label: 'Cadastro de irmãos',
  icon: 'users-round'
}, {
  key: 'admissoes',
  label: 'Admissões',
  icon: 'scroll-text',
  count: 4
}, {
  key: 'tesouraria',
  label: 'Tesouraria',
  icon: 'receipt-text'
}];
const NAV2 = [{
  key: 'capitulos',
  label: 'Capítulos e Arcas',
  icon: 'building-2'
}, {
  key: 'relatorios',
  label: 'Relatórios',
  icon: 'chart-no-axes-column'
}, {
  key: 'ajustes',
  label: 'Ajustes',
  icon: 'settings'
}];
function SideItem({
  item,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      textAlign: 'left',
      border: 0,
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: 'var(--radius-2)',
      font: 'inherit',
      fontSize: 'var(--fs-sm)',
      background: active ? 'rgba(255,255,255,.10)' : hover ? 'rgba(255,255,255,.05)' : 'transparent',
      color: active ? 'var(--neutral-0)' : 'rgba(250,248,244,.72)',
      borderLeft: `2px solid ${active ? 'var(--gold-400)' : 'transparent'}`,
      transition: 'var(--transition-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, item.label), item.count != null && /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-3xs)',
      color: 'var(--gold-300)'
    }
  }, item.count));
}
function Sidebar({
  screen,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--width-sidebar)',
      flex: '0 0 auto',
      background: 'var(--surface-navy)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      position: 'absolute',
      bottom: -30,
      left: -40,
      width: 260,
      filter: 'invert(1)',
      opacity: 0.06,
      mixBlendMode: 'screen',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      padding: '16px 16px 14px',
      borderBottom: '1px solid rgba(255,255,255,.10)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/keystone.jpg",
    alt: "",
    style: {
      width: 26,
      filter: 'invert(1)',
      mixBlendMode: 'screen'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-lg)',
      color: 'var(--neutral-0)'
    }
  }, "Ordens Inglesas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--gold-300)'
    }
  }, "Controle interno"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'grid',
      gap: 2,
      padding: 'var(--space-4) 10px'
    }
  }, NAV.map(i => /*#__PURE__*/React.createElement(SideItem, {
    key: i.key,
    item: i,
    active: screen === i.key,
    onClick: () => onNavigate(i.key)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(255,255,255,.10)',
      margin: '12px 12px'
    }
  }), NAV2.map(i => /*#__PURE__*/React.createElement(SideItem, {
    key: i.key,
    item: i,
    active: screen === i.key,
    onClick: () => onNavigate(i.key)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '14px 16px',
      borderTop: '1px solid rgba(255,255,255,.10)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'var(--gold-500)',
      color: 'var(--navy-700)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 14
    }
  }, "AB"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--neutral-0)'
    }
  }, "Ant\xF4nio V. Braga"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(250,248,244,.55)'
    }
  }, "Escriba \xB7 Cap\xEDtulo 12")), /*#__PURE__*/React.createElement(IconButton, {
    icon: "log-out",
    label: "Sair",
    size: "sm",
    style: {
      color: 'rgba(250,248,244,.72)'
    }
  })));
}
function Topbar({
  title,
  eyebrow,
  actions
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      minHeight: 'var(--height-topbar)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: '0 var(--space-6)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gap: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-xl)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, actions, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Notifica\xE7\xF5es"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Notifica\xE7\xF5es"
  })), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Ajuda"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "circle-help",
    label: "Ajuda"
  }))));
}
function Shell({
  screen,
  onNavigate,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    screen: screen,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, children));
}
function Placeholder({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-faint)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "square-dashed",
    size: 22,
    style: {
      margin: '0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", null, label, " \u2014 tela ainda n\xE3o especificada pelo cliente.")));
}
Object.assign(window, {
  Shell,
  Sidebar,
  Topbar,
  Placeholder,
  SideItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/Tesouraria.jsx
try { (() => {
const {
  Card,
  Badge,
  Tag,
  Button,
  IconButton,
  Input,
  Select,
  DataTable,
  RowActions,
  Tabs,
  Switch
} = window.OrdensInglesasDesignSystem_d5c0a9;
function Tesouraria() {
  const [aba, setAba] = React.useState('todos');
  const [auto, setAuto] = React.useState(true);
  const rows = window.LANCAMENTOS.filter(l => aba === 'todos' || (aba === 'abertos' ? l.sit[1] !== 'Quite' : l.sit[1] === 'Quite'));
  const total = rows.reduce((s, l) => s + parseFloat(l.valor.replace(/\./g, '').replace(',', '.')), 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Topbar, {
    eyebrow: "Exerc\xEDcio 2026",
    title: "Tesouraria",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      iconLeft: "download"
    }, "Extrato"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: "plus"
    }, "Novo lan\xE7amento"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-6)',
      display: 'grid',
      gap: 'var(--space-6)',
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Previsto",
    unit: "R$",
    value: "181.400",
    hint: "184 irm\xE3os ativos"
  }), /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Arrecadado",
    unit: "R$",
    value: "148.320",
    hint: "82% da previs\xE3o",
    tone: "success"
  }), /*#__PURE__*/React.createElement(Metric, {
    eyebrow: "Em atraso",
    unit: "R$",
    value: "9.640",
    hint: "11 irm\xE3os vencidos",
    tone: "danger"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: 'var(--space-6)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-end',
      padding: 'var(--space-4) var(--space-5) 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: aba,
    onChange: setAba,
    items: [{
      value: 'todos',
      label: 'Todos'
    }, {
      value: 'abertos',
      label: 'Em aberto'
    }, {
      value: 'quitados',
      label: 'Quitados'
    }],
    style: {
      flex: 1
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Buscar irm\xE3o ou documento",
    iconLeft: "search",
    wrapperStyle: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Select, {
    placeholder: "Todas as Ordens",
    options: Object.entries(window.ORDENS).map(([v, l]) => ({
      value: v,
      label: l
    })),
    wrapperStyle: {
      width: 190
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    empty: "Nenhum lan\xE7amento nesta situa\xE7\xE3o.",
    columns: [{
      key: 'doc',
      label: 'Documento',
      numeric: true,
      strong: true
    }, {
      key: 'data',
      label: 'Data',
      numeric: true
    }, {
      key: 'irmao',
      label: 'Irmão'
    }, {
      key: 'tipo',
      label: 'Tipo'
    }, {
      key: 'ordem',
      label: 'Ordem',
      render: r => /*#__PURE__*/React.createElement(Tag, {
        order: r.ordem
      }, window.ORDENS[r.ordem])
    }, {
      key: 'sit',
      label: 'Situação',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.sit[0],
        dot: true
      }, r.sit[1])
    }, {
      key: 'valor',
      label: 'Valor (BRL)',
      numeric: true,
      align: 'right'
    }, {
      key: 'acoes',
      label: '',
      align: 'right',
      render: () => /*#__PURE__*/React.createElement(RowActions, null, /*#__PURE__*/React.createElement(IconButton, {
        icon: "receipt-text",
        label: "Recibo",
        size: "sm"
      }), /*#__PURE__*/React.createElement(IconButton, {
        icon: "ellipsis-vertical",
        label: "Mais a\xE7\xF5es",
        size: "sm"
      }))
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-5)',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Total exibido"), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, "R$ ", total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Cobran\xE7a",
    title: "Anuidade 2026",
    accent: "marca"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Arco Real"), /*#__PURE__*/React.createElement("span", {
    className: "numeric"
  }, "R$ 1.240,00")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Marca"), /*#__PURE__*/React.createElement("span", {
    className: "numeric"
  }, "R$ 620,00")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Nautas"), /*#__PURE__*/React.createElement("span", {
    className: "numeric"
  }, "R$ 380,00")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-subtle)'
    }
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Cobran\xE7a autom\xE1tica",
    hint: "Envia aviso 10 dias antes",
    checked: auto,
    onChange: e => setAuto(e.target.checked)
  }))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: "Aten\xE7\xE3o",
    title: "Vencidos h\xE1 mais de 60 dias"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--space-3)'
    }
  }, window.IRMAOS.filter(i => i.sit[1] === 'Vencido' || i.sit[1] === 'Pendente').map(i => /*#__PURE__*/React.createElement("div", {
    key: i.id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-strong)'
    }
  }, i.nome), /*#__PURE__*/React.createElement("span", {
    className: "numeric",
    style: {
      fontSize: 'var(--fs-2xs)',
      color: 'var(--text-muted)'
    }
  }, i.mat)), /*#__PURE__*/React.createElement(Badge, {
    tone: i.sit[0],
    dot: true
  }, i.sit[1]))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    fullWidth: true,
    iconLeft: "mail"
  }, "Enviar avisos")))))));
}
window.Tesouraria = Tesouraria;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/Tesouraria.jsx", error: String((e && e.message) || e) }); }

// ui_kits/plataforma/dados.jsx
try { (() => {
const ORDENS = {
  'arco-real': 'Arco Real',
  marca: 'Mestre da Marca',
  nautas: 'Nautas da Arca Real'
};
const IRMAOS = [{
  id: 1,
  nome: 'João Alberto Ribeiro',
  mat: 'AR-2026-0184',
  ordem: 'arco-real',
  capitulo: 'Capítulo 12 · Recife',
  grau: 'Arco Real',
  sit: ['success', 'Quite'],
  valor: '1.240,00',
  desde: '14/03/2019',
  email: 'joao.ribeiro@exemplo.br'
}, {
  id: 2,
  nome: 'Carlos Mendes Fontes',
  mat: 'MM-2026-0091',
  ordem: 'marca',
  capitulo: 'Loja da Marca 4 · Olinda',
  grau: 'Mestre da Marca',
  sit: ['warning', 'Pendente'],
  valor: '620,00',
  desde: '02/08/2021',
  email: 'c.fontes@exemplo.br'
}, {
  id: 3,
  nome: 'Ruy Pereira Sampaio',
  mat: 'NA-2025-0042',
  ordem: 'nautas',
  capitulo: 'Arca 2 · Jaboatão',
  grau: 'Comandante Nauta',
  sit: ['danger', 'Vencido'],
  valor: '380,00',
  desde: '19/11/2017',
  email: 'ruy.sampaio@exemplo.br'
}, {
  id: 4,
  nome: 'Antônio Vilela Braga',
  mat: 'AR-2024-0117',
  ordem: 'arco-real',
  capitulo: 'Capítulo 12 · Recife',
  grau: 'Escriba',
  sit: ['success', 'Quite'],
  valor: '1.240,00',
  desde: '05/05/2015',
  email: 'a.braga@exemplo.br'
}, {
  id: 5,
  nome: 'Sérgio Luiz Andrade',
  mat: 'MM-2023-0076',
  ordem: 'marca',
  capitulo: 'Loja da Marca 4 · Olinda',
  grau: 'Mestre da Marca',
  sit: ['neutral', 'Arquivado'],
  valor: '0,00',
  desde: '30/01/2013',
  email: 's.andrade@exemplo.br'
}, {
  id: 6,
  nome: 'Paulo Henrique Lira',
  mat: 'AR-2026-0192',
  ordem: 'arco-real',
  capitulo: 'Capítulo 7 · Caruaru',
  grau: 'Companheiro exaltado',
  sit: ['success', 'Quite'],
  valor: '1.240,00',
  desde: '21/06/2022',
  email: 'p.lira@exemplo.br'
}];
const ADMISSOES = [{
  id: 'a1',
  nome: 'Marcelo Duarte Pinto',
  ordem: 'arco-real',
  origem: 'Loja Estrela do Norte 88',
  etapa: 2,
  sit: ['info', 'Em análise'],
  entrada: '11/06/2026',
  parecer: 'Escriba'
}, {
  id: 'a2',
  nome: 'Fernando Costa Neves',
  ordem: 'marca',
  origem: 'Loja Acácia 21',
  etapa: 3,
  sit: ['info', 'Em análise'],
  entrada: '02/06/2026',
  parecer: 'Tesoureiro'
}, {
  id: 'a3',
  nome: 'Otávio Reis Cunha',
  ordem: 'nautas',
  origem: 'Arca 2 · Jaboatão',
  etapa: 1,
  sit: ['warning', 'Pendente'],
  entrada: '28/05/2026',
  parecer: 'Documentação'
}, {
  id: 'a4',
  nome: 'Luís Gustavo Pimentel',
  ordem: 'arco-real',
  origem: 'Loja Fraternidade 3',
  etapa: 4,
  sit: ['success', 'Aprovado'],
  entrada: '14/05/2026',
  parecer: 'Concluído'
}];
const ETAPAS = ['Documentação', 'Parecer do Escriba', 'Quitação de taxas', 'Aprovação do Capítulo'];
const LANCAMENTOS = [{
  id: 'l1',
  data: '01/07/2026',
  doc: '2026/0184',
  irmao: 'João Alberto Ribeiro',
  tipo: 'Anuidade',
  ordem: 'arco-real',
  sit: ['success', 'Quite'],
  valor: '1.240,00'
}, {
  id: 'l2',
  data: '28/06/2026',
  doc: '2026/0183',
  irmao: 'Carlos Mendes Fontes',
  tipo: 'Anuidade',
  ordem: 'marca',
  sit: ['warning', 'Pendente'],
  valor: '620,00'
}, {
  id: 'l3',
  data: '25/06/2026',
  doc: '2026/0181',
  irmao: 'Ruy Pereira Sampaio',
  tipo: 'Anuidade',
  ordem: 'nautas',
  sit: ['danger', 'Vencido'],
  valor: '380,00'
}, {
  id: 'l4',
  data: '20/06/2026',
  doc: '2026/0179',
  irmao: 'Marcelo Duarte Pinto',
  tipo: 'Taxa de admissão',
  ordem: 'arco-real',
  sit: ['success', 'Quite'],
  valor: '480,00'
}, {
  id: 'l5',
  data: '18/06/2026',
  doc: '2026/0178',
  irmao: 'Antônio Vilela Braga',
  tipo: 'Anuidade',
  ordem: 'arco-real',
  sit: ['success', 'Quite'],
  valor: '1.240,00'
}, {
  id: 'l6',
  data: '12/06/2026',
  doc: '2026/0176',
  irmao: 'Paulo Henrique Lira',
  tipo: 'Joia de exaltação',
  ordem: 'arco-real',
  sit: ['success', 'Quite'],
  valor: '310,00'
}];
Object.assign(window, {
  ORDENS,
  IRMAOS,
  ADMISSOES,
  ETAPAS,
  LANCAMENTOS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/plataforma/dados.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.RowActions = __ds_scope.RowActions;

__ds_ns.SortMark = __ds_scope.SortMark;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
