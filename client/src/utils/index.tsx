export const handleSectionNavigation = (id: string) => {
    // @ts-ignore
    const element = document.getElementById(id);
    const offset = 45;
    // @ts-ignore
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element?.getBoundingClientRect().top ?? 0;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    // @ts-ignore
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};
