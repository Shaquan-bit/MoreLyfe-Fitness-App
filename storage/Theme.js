export const Colors = {
  background: "#0A0A0A",
  surface: "#141414",
  surfaceAlt: "#1E1E1E",

  primary: "#B6FF45",
  secondary: "#D8FF8A",

  textPrimary: "#F8F8F4",
  textSecondary: "#9FA69A",
  textDark: "#0A0A0A",

  success: "#9BE66A",
  danger: "#FF6B6B",
  warning: "#F7B955",

  border: "#2A2A2A",
};

export const SharedStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },

  subheading: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: Colors.textDark,
    fontWeight: "bold",
    fontSize: 15,
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 15,
  },

  dangerButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  dangerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  input: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
